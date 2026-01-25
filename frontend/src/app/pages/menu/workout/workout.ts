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
import { WorkoutService } from '@/pages/service/workout/workout.service';
import { ExerciseService } from '@/pages/service/exercise/exercise.service';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';


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

    private destroy$ = new Subject<void>();

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private workoutFacade: WorkoutFacade,
        private workoutExerciseFacade: WorkoutExerciseFacade,
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


        this.workoutFacade
            .createWorkout(this.workout)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (createdWorkout) => {
                    this.workout = createdWorkout;
                    console.log(this.workout);
                    console.log(this.selectedExercises);
                    this.createWorkoutExercises();

                },
                error: (err) => {
                    console.error('Failed to create workout', err);
                    const detail = err?.message ?? 'unknown';
                }
            })


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
        this.selectedExercises.splice(index, 1);
        console.log('Exercise removed, current list:', this.selectedExercises);
    }

    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('id');
        console.log('Workout ID:', id);

        if (id) {
            // fetch workout basic info
            this.workoutService.getById(id).subscribe({
                next: (workout) => {
                    this.workout = workout;
                    this.workoutName = workout.name;
                    console.log('Workout:', workout);

                    // then fetch exercises for this workout
                    this.exerciseService.getExercisesByWorkoutId(id).subscribe({
                        next: (exercises) => {
                            console.log('Exercises for workout:', exercises);
                            this.selectedExercises = exercises.map(exercise => ({
                                id: '', // or exercise.id if backend sends workoutExercise id
                                exercise: exercise,
                                workout: this.workout, // current workout
                                sets: exercise.sets ?? 1,
                                reps: exercise.repetitions ?? 1,
                                weight: 0
                            }));

                        },
                        error: (err) => console.error('Error fetching exercises:', err)
                    });
                },
                error: (err) => console.error('Error fetching workout:', err)
            });
        }
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
