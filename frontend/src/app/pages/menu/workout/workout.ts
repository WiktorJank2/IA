import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AutoCompleteModule } from 'primeng/autocomplete';
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

import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';


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
        DatePipe
    ]
})
export class Workout {

    selectedAutoValue: string | null = null;
    autoFilteredValue: string[] = [];
    allExercises: ExerciseDto[] = [];
    selectedExercises: ExerciseDto[] = [];
    loading = true;
    workoutName: string = '';

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('dt1') dt1!: Table;

    constructor(
        private exerciseFacade: ExerciseFacade,
    private workoutFacade: WorkoutFacade,
    private router: Router
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

        console.log('Autocomplete select event:', event);
        console.log('Selected name from autocomplete:', selectedName);

        const selected = this.allExercises.find(
            ex => ex.name.trim() === selectedName.trim()
        );

        console.log('Matched exercise object:', selected);

        if (selected) {
            if (!this.selectedExercises.includes(selected)) {
                this.selectedExercises.push(selected);
                console.log('Added to table:', selected);
                console.log('Current selectedExercises array:', this.selectedExercises);
            } else {
                console.log('Exercise already in table');
            }
        } else {
            console.log('No matching exercise found!');
        }

        this.selectedAutoValue = null;
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
        if (!this.workoutName || this.selectedExercises.length === 0) {
            console.log('Workout name or exercises missing');
            return;
        }

        const workoutPayload: WorkoutDto = {
            name: this.workoutName,
            exercises: this.selectedExercises.map(ex => ({
                id: ex.id!,
                sets: ex.sets || 3, // default to 3 if not set
                repetitions: ex.repetitions || 10 // default to 10 if not set
            }))
        };

        console.log('Workout payload:', workoutPayload);

        this.workoutFacade.createWorkout(workoutPayload).subscribe({
            next: () => {
                console.log('Workout saved successfully');
                this.router.navigate(['/']);
            },
            error: err => {
                console.error('Failed to save workout', err);
            }
        });
    }
    removeExercise(index: number) {
        this.selectedExercises.splice(index, 1);
        console.log('Exercise removed, current list:', this.selectedExercises);
    }
}
