import { Component, ViewChild } from '@angular/core';
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
import {BodyCanvas} from "@/layout/body-canvas/body-canvas";
import { ActivatedRoute } from '@angular/router';




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
        MultiSelect,
        BodyCanvas
    ],
    templateUrl: './exercise.html',
    standalone: true,
    styleUrl: './exercise.scss'
})
export class Exercise {
    name = '';
    description = '';
    exerciseId: string | null = null;
    selectedMuscles: string[] = [];
    difficultyRating: number | null = null;
    effectivenessRating: number | null = null;
    overallRating: number | null = null;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private router: Router,
        private route: ActivatedRoute,
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
    @ViewChild(BodyCanvas) bodyCanvas!: BodyCanvas;


    ngOnInit() {
        this.exerciseId = this.route.snapshot.queryParamMap.get('id');

        if (this.exerciseId) {
            // EDIT MODE
            this.exerciseFacade.getById(this.exerciseId).subscribe(exercise => {
                this.fillForm(exercise);
            });
        }
    }

    dropdownItem = null;
    protected muscleLoad: any;

    fillForm(exercise: ExerciseDto) {
        this.name = exercise.name;
        this.description = exercise.description;
        this.selectedMuscles = exercise.muscles;
        this.difficultyRating = exercise.difficultyRating;
        this.effectivenessRating = exercise.effectivenessRating;
        this.overallRating = exercise.overallRating;

        this.updateCanvasMuscles();
    }

    saveExercise() {
        if (
            !this.name ||
            !this.description ||
            !this.difficultyRating ||
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
            difficultyRating: this.difficultyRating,
            effectivenessRating: this.effectivenessRating,
            overallRating: this.overallRating
        };

        console.log('Exercise payload:', exercise);

        if (this.exerciseId) {
            //UPDATE
            console.log('UPDATING exercise with id:', this.exerciseId);
            console.log('Payload:', exercise);

            this.exerciseFacade.updateExercise(this.exerciseId, exercise).subscribe({
                error: err => {
                    console.error('Failed to update exercise', err);
                }
            });
        } else {
            //CREATE
            this.exerciseFacade.createExercise(exercise).subscribe({
                error: err => console.error('Failed to create exercise', err)
            });
        }
    }

    updateCanvasMuscles() {
        if (!this.bodyCanvas) return; // ensure canvas exists
        this.bodyCanvas.activeMuscles = this.selectedMuscles;
        this.bodyCanvas.applyActiveMuscles();
    }
    ngAfterViewInit() {
        // optional: initialize with current selection
        this.updateCanvasMuscles();
    }
}
