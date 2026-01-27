import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { Table, TableModule  } from 'primeng/table';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutExerciseDto } from '@/pages/service/workoutExercise/workoutExercise.model';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { WorkoutExerciseFacade } from '@/pages/service/workoutExercise/workoutExercise.facade'
import { WorkoutExerciseService } from '@/pages/service/workoutExercise/workoutExercise.service'
import { WorkoutService } from '@/pages/service/workout/workout.service';
import { ExerciseService } from '@/pages/service/exercise/exercise.service';
import { forkJoin, Subject, switchMap, takeUntil, tap } from 'rxjs';


@Component({
    selector: 'app-plan',
    standalone: true,
    templateUrl: './workout.html',
    styleUrl: './workout.scss',
    providers: [ConfirmationService, MessageService],
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,

        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        AutoCompleteModule,
        TagModule,
        ProgressBarModule,
        SliderModule,
        SelectModule,
        MultiSelectModule,
        ToggleButtonModule,
        ToastModule,
        RatingModule,
        RippleModule,
        TableModule,

        CurrencyPipe,
        DatePipe,
        AutoComplete,
        AutoComplete
    ]
})
export class Workout {
    workout: WorkoutDto = { id: '', name: ''};
    selectedAutoValue: string | null = null;
    autoFilteredValue: string[] = [];
    allExercises: ExerciseDto[] = [];
    selectedExercises: WorkoutExerciseDto[] = [];    loading = true;
    workoutName: string = '';
    deletedExercises: WorkoutExerciseDto[] = [];

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private workoutFacade: WorkoutFacade,
        private workoutExerciseFacade: WorkoutExerciseFacade,
        private workoutExerciseService: WorkoutExerciseService,
        private route: ActivatedRoute,
        private router: Router,
        private workoutService: WorkoutService,
        private exerciseService: ExerciseService,
) {
        this.exerciseFacade.fetchAllExercises();

        this.exerciseFacade.exerciseState$.subscribe(exercises => {
            this.allExercises = exercises;
            this.loading = false;

            console.log('Exercises from backend:', exercises);
        });
    }

    onExerciseSelect(event: any) {
        const selectedName: string = event.value;

        // Find the ExerciseDto object
        const selectedExercise = this.allExercises.find(
            ex => ex.name.trim() === selectedName.trim()
        );

        if (selectedExercise) {
            // Check if this exercise is already in the table
            const alreadyAdded = this.selectedExercises.some(
                we => we.exercise.id === selectedExercise.id
            );

            if (!alreadyAdded) {
                // Wrap ExerciseDto into WorkoutExerciseDto
                const workoutExercise: WorkoutExerciseDto = {
                    id: '', // leave empty for new
                    exercise: selectedExercise,
                    workout: this.workout,
                    sets: 1,
                    reps: 1,
                    weight: 0
                };

                this.selectedExercises.push(workoutExercise);
                console.log('Added to table:', workoutExercise);
            } else {
                console.log('Exercise already in table');
            }
        } else {
            console.log('No matching exercise found!');
        }

        // Reset autocomplete input
        this.selectedAutoValue = null;
    }

    loadWorkout(id: string) {
        this.workoutFacade.getById(id).subscribe({
            next: (workout) => {
                this.workout = workout;
            },
            error: (err) => console.error('Failed to load workout', err)
        });
    }

    filterExercise(event: any) {
        const query = event.query.toLowerCase();

        console.log('User typed:', event.query);

        this.autoFilteredValue = this.allExercises
            .filter(ex => ex.name.toLowerCase().includes(query))
            .map(ex => ex.name);

        console.log('Filtered exercises:', this.autoFilteredValue);
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        console.log('Global filter value:', value);

        this.dt1.filterGlobal(value, 'contains');
    }

    clear() {
        console.log('Clearing table and filters');

        this.selectedExercises = [];
        this.dt1.clear();
    }
    saveWorkout() {
        if (!this.workout.name || this.selectedExercises.length === 0) {
            console.log('Workout name or exercises missing');
            return;
        }

        // 🔹 If workout already exists, update it
        if (this.workout.id && this.workout.id !== '') {
            // 1️⃣ Handle new exercises first
            const newExercises = this.selectedExercises.filter(e => !e.id);
            const addObservables = newExercises.map(ex =>
                this.workoutExerciseFacade.addWorkoutExercise({ ...ex, workout: this.workout })
            );

            // 2️⃣ Handle deleted exercises
            const deletedExercises = this.deletedExercises || [];
            const deleteObservables = deletedExercises.map(exId =>
                this.workoutExerciseFacade.deleteWorkoutExercise(exId.id)
            );

            // 3️⃣ Handle existing exercises updates (sets/reps)
            const existingExercises = this.selectedExercises.filter(e => e.id);
            const updateObservables = existingExercises.map(ex =>
                this.workoutExerciseFacade.updateWorkoutExercise(ex.id!, ex)
            );

            // Execute all operations
            forkJoin([...addObservables, ...deleteObservables, ...updateObservables])
                .pipe(
                    takeUntil(this.destroy$),
                    switchMap(() => this.workoutFacade.updateWorkout(this.workout.id!, this.workout))
                )
                .subscribe({
                    next: updatedWorkout => {
                        this.workout = updatedWorkout;
                        console.log('Workout fully updated:', this.workout);
                        // Clear deletedExercises for next save
                        this.deletedExercises = [];
                    },
                    error: err => {
                        console.error('Failed to update workout and exercises', err);
                    }
                });

            return;
        }

        // 🔹 CREATE new workout (existing logic – unchanged)
        this.workoutFacade
            .createWorkout(this.workout)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: createdWorkout => {
                    this.workout = createdWorkout;
                    console.log(this.workout);
                    console.log(this.selectedExercises);
                    this.createWorkoutExercises();
                },
                error: err => {
                    console.error('Failed to create workout', err);
                }
            });
    }


    createWorkoutExercises(){
        this.selectedExercises.forEach(exercise => {
            exercise.workout = this.workout;
        });
        this.workoutExerciseFacade.createWorkoutExercises(this.selectedExercises);
        this.workoutExerciseFacade.workoutExerciseState$
            .pipe(tap((created) => (this.selectedExercises = created)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    goToExercise(exerciseId: string) {
        // Optional: fetch exercise details in the facade so Exercise page can display immediately
        this.exerciseFacade.getById(exerciseId).subscribe({
            next: (exercise) => {
                console.log('Navigating to exercise:', exercise);
                this.router.navigate(['/menu/exercise'], { queryParams: { id: exerciseId } });
            },
            error: (err) => console.error('Failed to fetch exercise', err)
        });
    }

    removeExercise(index: number) {
        const removed: WorkoutExerciseDto = this.selectedExercises.splice(index, 1)[0];
        this.deletedExercises.push(removed);
        this.workoutExerciseFacade.deleteWorkoutExercise(removed.id).subscribe({
            next: () => console.log('Deleted on backend:', removed),
            error: err => console.error('Failed to delete exercise', err)
        });    }

    ngOnInit() {
        console.log('ngOnInit START');

        const id = this.route.snapshot.queryParamMap.get('id');
        console.log('Query param id:', id);

        if (id) {
            console.log('ID exists, fetching workout...');

            this.workoutService.getById(id).subscribe({
                next: (workout) => {
                    console.log('getById SUCCESS');
                    console.log('Raw workout response:', workout);

                    this.workout = workout;
                    this.workoutName = workout.name;

                    console.log('Workout assigned to component:', this.workout);
                    console.log('Workout name set to:', this.workoutName);

                    console.log('Fetching exercises for workout id:', id);

                    this.workoutExerciseService.getWorkoutExercisesByWorkoutId(id).subscribe({
                        next: (workoutExerciseDtos) => {
                            console.log('getExercisesByWorkoutId SUCCESS');
                            console.log('Raw exercises response:', workoutExerciseDtos);

                            this.selectedExercises = workoutExerciseDtos;

                            console.log('selectedExercises assigned:', this.selectedExercises);
                            console.log('Number of exercises:', this.selectedExercises.length);
                        },
                        error: (err) => {
                            console.error('getExercisesByWorkoutId ERROR');
                            console.error(err);
                        },
                        complete: () => {
                            console.log('getExercisesByWorkoutId COMPLETE');
                        }
                    });
                },
                error: (err) => {
                    console.error('getById ERROR');
                    console.error(err);
                },
                complete: () => {
                    console.log('getById COMPLETE');
                }
            });
        } else {
            console.warn('No workout ID found in query params');
        }

        console.log('ngOnInit END (async calls may still be running)');
    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    fillForm(workout: WorkoutDto) {
        this.workout = workout;
        this.workoutName = workout.name;
    }
}
