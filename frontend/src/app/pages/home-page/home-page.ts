import { Component, OnInit } from '@angular/core';
import {Panel} from "primeng/panel";
import {Splitter} from "primeng/splitter";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Image} from "primeng/image";
import { AutoCompleteModule } from 'primeng/autocomplete';
import {RouterLink} from "@angular/router";
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',

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
        Image
    ],
    standalone: true,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {
    autoValue: any[] | undefined;
    selectedAutoValue: string | null = null;
    autoFilteredValue: string[] = [];
    allExercises: ExerciseDto[] = [];

    constructor(private exerciseFacade: ExerciseFacade) {
        // Fetch exercises from the backend
        this.exerciseFacade.fetchAllExercises();

        // Subscribe to the BehaviorSubject and store the exercises
        this.exerciseFacade.exerciseState$.subscribe(exercises => {
            this.allExercises = exercises;
            console.log('Exercises from backend:', exercises); // <-- log here
        });
    }

    filterExercise(event: any) {
        const query = event.query.toLowerCase();

        // Filter and map to strings so the autocomplete input displays correctly
        this.autoFilteredValue = this.allExercises
            .filter(ex => ex.name.toLowerCase().includes(query))
            .map(ex => ex.name);

        console.log('Filtered exercises:', this.autoFilteredValue); // optional, for debugging
    }
}
