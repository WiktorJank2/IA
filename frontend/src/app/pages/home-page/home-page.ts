import { Component, OnInit } from '@angular/core';
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

import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

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
        CommonModule
    ]
})
export class HomePage implements OnInit {
    autoValue: any[] | undefined;
    selectedAutoValue: string | null = null;
    autoFilteredValue: string[] = [];
    allExercises: ExerciseDto[] = [];

    workoutsMap: Map<string, WorkoutDto> = new Map();
    currentPlan: PlanDto | null = null;

    constructor(
        private exerciseFacade: ExerciseFacade,
        private planFacade: PlanFacade,
        private workoutFacade: WorkoutFacade,
        private router: Router
    ) {}

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
}
