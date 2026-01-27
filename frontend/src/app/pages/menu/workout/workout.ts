import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

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
import { Table, TableModule } from 'primeng/table';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutExerciseDto } from '@/pages/service/workoutExercise/workoutExercise.model';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { WorkoutExerciseFacade } from '@/pages/service/workoutExercise/workoutExercise.facade';
import { WorkoutExerciseService } from '@/pages/service/workoutExercise/workoutExercise.service';
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

    // Currently edited workout
    workout: WorkoutDto = { id: '', name: '' };

    // Autocomplete input value
    selectedAutoValue: string | null = null;

    // Filtered autocomplete suggestions
    autoFilteredValue: string[] = [];

    // All available exercises
    allExercises: ExerciseDto[] = [];

    // Exercises assigned to this workout
    selectedExercises: WorkoutExerciseDto[] = [];

    // Loading state
    loading = true;

    // Workout name bound to input
    workoutName: string = '';

    // Exercises removed during editing
    deletedExercises: WorkoutExerciseDto[] = [];

    // Used to clean up subscriptions
    private destroy$ = new Subject<void>();

    // Reference to filter input
    @ViewChild('filter') filter!: ElementRef;

    // Reference to PrimeNG table
    @ViewChild('dt1') dt1!: Table;

    constructor(
        // Facade for exercises
        private exerciseFacade: ExerciseFacade,

        // Facade for workouts
        private workoutFacade: WorkoutFacade,

        // Facade for workout–exercise relations
        private workoutExerciseFacade: WorkoutExerciseFacade,

        // Service for workout–exercise API calls
        private workoutExerciseService: WorkoutExerciseService,

        // Route access for query params
        private route: ActivatedRoute,

        // Router for navigation
        private router: Router,

        // Service for workouts
        private workoutService: WorkoutService,

        // Service for exercises
        private exerciseService: ExerciseService,
    ) {
        // Load all exercises on component creation
        this.exerciseFacade.fetchAllExercises();

        // Subscribe to exercise state
        this.exerciseFacade.exerciseState$.subscribe(exercises => {
            this.allExercises = exercises;
            this.loading = false;
        });
    }

    // Handles selecting an exercise from autocomplete
    onExerciseSelect(event: any) {
        const selectedName: string = event.value;

        // Find matching exercise by name
        const selectedExercise = this.allExercises.find(
            ex => ex.name.trim() === selectedName.trim()
        );

        if (selectedExercise) {
            // Check if exercise already exists in table
            const alreadyAdded = this.selectedExercises.some(
                we => we.exercise.id === selectedExercise.id
            );

            if (!alreadyAdded) {
                // Wrap exercise into WorkoutExerciseDto
                const workoutExercise: WorkoutExerciseDto = {
                    id: '',
                    exercise: selectedExercise,
                    workout: this.workout,
                    sets: 1,
                    reps: 1,
                    weight: 0
                };

                this.selectedExercises.push(workoutExercise);
            }
        }

        // Clear autocomplete input
        this.selectedAutoValue = null;
    }

    // Loads workout basic data by ID
    loadWorkout(id: string) {
        this.workoutFacade.getById(id).subscribe({
            next: workout => {
                this.workout = workout;
            }
        });
    }

    // Filters exercises for autocomplete
    filterExercise(event: any) {
        const query = event.query.toLowerCase();

        this.autoFilteredValue = this.allExercises
            .filter(ex => ex.name.toLowerCase().includes(query))
            .map(ex => ex.name);
    }

    // Applies global filter to the table
    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(value, 'contains');
    }

    // Clears table data and filters
    clear() {
        this.selectedExercises = [];
        this.dt1.clear();
    }

    // Saves or updates workout with its exercises
    saveWorkout() {
        if (!this.workout.name || this.selectedExercises.length === 0) {
            return;
        }

        // Update existing workout
        if (this.workout.id && this.workout.id !== '') {
            const newExercises = this.selectedExercises.filter(e => !e.id);
            const addObservables = newExercises.map(ex =>
                this.workoutExerciseFacade.addWorkoutExercise({ ...ex, workout: this.workout })
            );

            const deleteObservables = this.deletedExercises.map(ex =>
                this.workoutExerciseFacade.deleteWorkoutExercise(ex.id)
            );

            const updateObservables = this.selectedExercises
                .filter(e => e.id)
                .map(ex =>
                    this.workoutExerciseFacade.updateWorkoutExercise(ex.id!, ex)
                );

            forkJoin([...addObservables, ...deleteObservables, ...updateObservables])
                .pipe(
                    takeUntil(this.destroy$),
                    switchMap(() =>
                        this.workoutFacade.updateWorkout(this.workout.id!, this.workout)
                    )
                )
                .subscribe(updatedWorkout => {
                    this.workout = updatedWorkout;
                    this.deletedExercises = [];
                });

            return;
        }

        // Create new workout
        this.workoutFacade
            .createWorkout(this.workout)
            .pipe(takeUntil(this.destroy$))
            .subscribe(createdWorkout => {
                this.workout = createdWorkout;
                this.createWorkoutExercises();
            });
    }

    // Creates workout–exercise relations for new workout
    createWorkoutExercises() {
        this.selectedExercises.forEach(exercise => {
            exercise.workout = this.workout;
        });

        this.workoutExerciseFacade.createWorkoutExercises(this.selectedExercises);

        this.workoutExerciseFacade.workoutExerciseState$
            .pipe(
                tap(created => (this.selectedExercises = created)),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    // Navigates to exercise details page
    goToExercise(exerciseId: string) {
        this.exerciseFacade.getById(exerciseId).subscribe(() => {
            this.router.navigate(['/menu/exercise'], { queryParams: { id: exerciseId } });
        });
    }

    // Removes exercise from workout and marks it for deletion
    removeExercise(index: number) {
        const removed = this.selectedExercises.splice(index, 1)[0];
        this.deletedExercises.push(removed);

        this.workoutExerciseFacade.deleteWorkoutExercise(removed.id).subscribe();
    }

    // Initializes workout and exercises based on route param
    ngOnInit() {
        const id = this.route.snapshot.queryParamMap.get('id');

        if (id) {
            this.workoutService.getById(id).subscribe(workout => {
                this.workout = workout;
                this.workoutName = workout.name;

                this.workoutExerciseService
                    .getWorkoutExercisesByWorkoutId(id)
                    .subscribe(workoutExerciseDtos => {
                        this.selectedExercises = workoutExerciseDtos;
                    });
            });
        }
    }

    // Cleans up subscriptions
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Fills form with existing workout data
    fillForm(workout: WorkoutDto) {
        this.workout = workout;
        this.workoutName = workout.name;
    }
}
