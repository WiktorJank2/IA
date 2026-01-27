import { Component, OnInit, ViewChild } from '@angular/core';
import { Panel } from "primeng/panel";
import { Splitter } from "primeng/splitter";
import { Button } from "primeng/button";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Image } from "primeng/image";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MUSCLE_TO_POLYGONS } from '@/layout/body-canvas/muscle-polygons.map';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { WorkoutExerciseFacade } from '@/pages/service/workoutExercise/workoutExercise.facade';
import { WorkoutExerciseDto } from '@/pages/service/workoutExercise/workoutExercise.model';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {BodyCanvas} from "@/layout/body-canvas/body-canvas";
import { take, map, tap, forkJoin, Observable, catchError, of} from 'rxjs';



type ColorKey = 'green' | 'orange' | 'red';
type MuscleLoadMap = Record<string, number>;


@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.html',
    styleUrls: ['./home-page.scss'],
    imports: [
        Panel,
        Splitter,
        Button,
        IconField,
        InputIcon,
        InputText,
        Image,
        RouterLink,
        FormsModule,
        AutoCompleteModule,
        ButtonModule,
        CommonModule,
        BodyCanvas
    ]
})
export class HomePage implements OnInit {
    autoValue: any[] | undefined;
    selectedAutoValue: string | null = null;
    autoFilteredValue: string[] = [];
    allExercises: ExerciseDto[] = [];
    polygonColors: Record<string, ColorKey> = {};
    muscleLoad: Record<string, number> = {};
    workoutsMap: Map<string, WorkoutDto> = new Map();
    currentPlan: PlanDto | null = null;
    selectedExercises: WorkoutExerciseDto[] = [];

    constructor(
        private exerciseFacade: ExerciseFacade,
        private planFacade: PlanFacade,
        private workoutFacade: WorkoutFacade,
        private workoutExerciseFacade: WorkoutExerciseFacade,
        private router: Router
    ) {}

    @ViewChild(BodyCanvas) bodyCanvas!: BodyCanvas;
    ngOnInit() {
        // Fetch exercises
        this.exerciseFacade.fetchAllExercises();
        this.exerciseFacade.exerciseState$.subscribe(exercises => {
            this.allExercises = exercises;
            console.log('Exercises from backend:', exercises);
        });

        // Fetch workouts
        this.workoutFacade.fetchAllWorkouts();
        this.workoutFacade.workoutState$.subscribe(workouts => {
            this.workoutsMap = new Map(workouts.map(w => [w.id!, w]));
            console.log('Workouts map:', this.workoutsMap);
        });

        // Fetch plans
        this.planFacade.fetchAllPlans();
        this.planFacade.planState$.subscribe(plans => {
            console.log('All plans:', plans);
            this.currentPlan = plans.find(p => p.current === true) ?? null;
            console.log('Current plan:', this.currentPlan);
        });

        this.planFacade.getCurrentPlan().subscribe({
            next: (currentPlan) => {
                this.loadMuscleActivity(currentPlan.workoutIds).subscribe();
            },
            error: (err) => console.error('Failed to get current plan:', err)
        });

    }

    onExerciseSelected(event: any) {
        const exerciseName = event.value;

        const exercise = this.allExercises.find(e => e.name === exerciseName);
        if (!exercise) return;

        this.router.navigate(['/menu/exercise'], {
            queryParams: { id: exercise.id }
        });
    }

    filterExercise(event: any) {
        const query = event.query.toLowerCase();
        this.autoFilteredValue = this.allExercises
            .filter(ex => ex.name.toLowerCase().includes(query))
            .map(ex => ex.name);
    }

    loadMuscleActivity(workoutIds: string[]): Observable<void> {
        const muscleLoad: Record<string, number> = {};
        console.log('Loading muscle activity for workout IDs:', workoutIds);

        const requests = workoutIds.map(id => {
            console.log('Fetching exercises for workout:', id);
            return this.workoutExerciseFacade.getWorkoutExercisesByWorkoutId(id).pipe(
                take(1), // ensures completion after first value
                tap(workoutExercises => console.log(`Received ${workoutExercises?.length ?? 0} exercises for workout ${id}:`, workoutExercises)),
                catchError(err => {
                    console.error(`Error fetching exercises for workout ${id}:`, err);
                    return of([]); // return empty array on error so forkJoin continues
                })
            );
        });

        return forkJoin(requests).pipe(
            tap(workoutsArrays => {
                workoutsArrays.forEach((exercises, workoutIndex) => {
                    exercises.forEach(we => {

                        if (we.exercise?.muscles?.length) {
                            const volume = we.sets * we.reps;

                            we.exercise.muscles.forEach(muscle => {
                                muscleLoad[muscle] = (muscleLoad[muscle] ?? 0) + volume;
                            });
                        } else {
                            console.warn('No muscles found for this exercise:', we);
                        }
                    });
                });

                console.log('Computed muscleLoad:', muscleLoad);

                this.muscleLoad = muscleLoad;

                if (this.bodyCanvas) {
                    console.log('Updating BodyCanvas with muscleLoad');
                    this.bodyCanvas.muscleLoad = this.muscleLoad;
                    this.bodyCanvas.applyMuscleColors();
                } else {
                    console.error('BodyCanvas instance is undefined');
                }
            }),
            map(() => void 0)
        );
    }



}
