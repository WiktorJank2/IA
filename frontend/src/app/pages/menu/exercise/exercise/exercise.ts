import { Component } from '@angular/core';
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {Textarea} from "primeng/textarea";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Image} from "primeng/image";
import {Router} from "@angular/router";
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { MultiSelect } from 'primeng/multiselect';




@Component({
    selector: 'app-exercise',
    imports: [
        InputText,
        Select,
        Textarea,
        FormsModule,
        Button,
        RouterLink,
        Image,
        MultiSelect
    ],
    templateUrl: './exercise.html',
    standalone: true,
    styleUrl: './exercise.scss'
})
export class Exercise {
    name = '';
    description = '';

    selectedMuscles: string[] = [];
    simplicityRating: number | null = null;
    effectivenessRating: number | null = null;
    overallRating: number | null = null;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private router: Router
    ) {}
    muscleOptions = [
        { label: 'Abdominals', value: 'Abdominals' },
        { label: 'Adductors', value: 'Adductors' },
        { label: 'Biceps', value: 'Biceps' },
        { label: 'Calves', value: 'Calves' },
        { label: 'Chest', value: 'Chest' },
        { label: 'Forearms', value: 'Forearms' },
        { label: 'Glutes', value: 'Glutes' },
        { label: 'Hamstrings', value: 'Hamstrings' },
        { label: 'Hip Flexors', value: 'Hip Flexors' },
        { label: 'Lats', value: 'Lats' },
        { label: 'Lower Back', value: 'Lower Back' },
        { label: 'Neck', value: 'Neck' },
        { label: 'Obliques', value: 'Obliques' },
        { label: 'Quadriceps', value: 'Quadriceps' },
        { label: 'Rear Deltoids', value: 'Rear Deltoids' },
        { label: 'Shoulders', value: 'Shoulders' },
        { label: 'Trapezius', value: 'Trapezius' },
        { label: 'Triceps', value: 'Triceps' },
        { label: 'Upper Back', value: 'Upper Back' }
    ];

    simplicityR = [
        { label: 'Very Easy', value: 1 },
        { label: 'Easy', value: 2 },
        { label: 'Medium', value: 3 },
        { label: 'Hard', value: 4 },
        { label: 'Very Hard', value: 5 }
    ];
    effectivenessR = [
        { label: 'Very Low', value: 1 },
        { label: 'Low', value: 2 },
        { label: 'Medium', value: 3 },
        { label: 'High', value: 4 },
        { label: 'Very High', value: 5 }
    ];
    overallR = [
        { label: '1 / 5', value: 1 },
        { label: '2 / 5', value: 2 },
        { label: '3 / 5', value: 3 },
        { label: '4 / 5', value: 4 },
        { label: '5 / 5', value: 5 }
    ];

    dropdownItem = null;

    saveExercise() {
        if (
            !this.name ||
            !this.description ||
            !this.simplicityRating ||
            !this.effectivenessRating ||
            !this.overallRating ||
            this.selectedMuscles.length === 0
        ) {
            console.log('Missing required fields');
            return;
        }

        const exercise: ExerciseDto = {
            id: '',
            name: this.name,
            description: this.description,
            muscles: this.selectedMuscles,
            difficultyRating: this.simplicityRating,
            effectivenessRating: this.effectivenessRating,
            overallRating: this.overallRating
        };

        console.log('Exercise payload:', exercise);

        this.exerciseFacade.createExercise(exercise).subscribe({
            next: () => console.log('Exercise saved'),
            error: err => console.error('Failed to save exercise', err)
        });
    }

}
