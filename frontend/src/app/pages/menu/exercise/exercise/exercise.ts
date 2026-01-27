import { Component, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Image } from 'primeng/image';
import { MultiSelect } from 'primeng/multiselect';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { BodyCanvas } from '@/layout/body-canvas/body-canvas';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.html',
    styleUrl: './exercise.scss',
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
    ]
})
export class Exercise {
    // Form fields
    name = '';
    description = '';
    selectedMuscles: string[] = [];
    difficultyRating: number | null = null;
    effectivenessRating: number | null = null;
    overallRating: number | null = null;

    // Current exercise ID (edit mode)
    exerciseId: string | null = null;

    // Reference to body canvas component
    @ViewChild(BodyCanvas) bodyCanvas!: BodyCanvas;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    // Available muscle options
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

    // Difficulty rating options
    simplicityR = [
        { label: 'Very Easy', value: 1 },
        { label: 'Easy', value: 2 },
        { label: 'Medium', value: 3 },
        { label: 'Hard', value: 4 },
        { label: 'Very Hard', value: 5 }
    ];

    // Effectiveness rating options
    effectivenessR = [
        { label: 'Very Low', value: 1 },
        { label: 'Low', value: 2 },
        { label: 'Medium', value: 3 },
        { label: 'High', value: 4 },
        { label: 'Very High', value: 5 }
    ];

    // Overall rating options
    overallR = [
        { label: '1 / 5', value: 1 },
        { label: '2 / 5', value: 2 },
        { label: '3 / 5', value: 3 },
        { label: '4 / 5', value: 4 },
        { label: '5 / 5', value: 5 }
    ];

    // Loads exercise data when editing
    ngOnInit() {
        this.exerciseId = this.route.snapshot.queryParamMap.get('id');

        if (this.exerciseId) {
            this.exerciseFacade.getById(this.exerciseId).subscribe(exercise => {
                this.fillForm(exercise);
            });
        }
    }

    // Populates form fields from backend data
    fillForm(exercise: ExerciseDto) {
        this.name = exercise.name;
        this.description = exercise.description;
        this.selectedMuscles = exercise.muscles;
        this.difficultyRating = exercise.difficultyRating;
        this.effectivenessRating = exercise.effectivenessRating;
        this.overallRating = exercise.overallRating;

        this.updateCanvasMuscles();
    }

    // Creates or updates an exercise
    saveExercise() {
        if (
            !this.name ||
            !this.description ||
            !this.difficultyRating ||
            !this.effectivenessRating ||
            !this.overallRating ||
            this.selectedMuscles.length === 0
        ) {
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

        if (this.exerciseId) {
            this.exerciseFacade.updateExercise(this.exerciseId, exercise).subscribe();
        } else {
            this.exerciseFacade.createExercise(exercise).subscribe();
        }
    }

    // Syncs selected muscles with the body canvas
    updateCanvasMuscles() {
        if (!this.bodyCanvas) return;

        this.bodyCanvas.activeMuscles = this.selectedMuscles;
        this.bodyCanvas.applyActiveMuscles();
    }

    // Ensures canvas reflects initial selection
    ngAfterViewInit() {
        this.updateCanvasMuscles();
    }
}
