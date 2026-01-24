import {IconField} from "primeng/iconfield";
import {InputText} from "primeng/inputtext";
import {Image} from "primeng/image";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";

import { Component } from '@angular/core';
import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { Router } from '@angular/router';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.html',
    styleUrls: ['./plan.scss'],
    standalone: true,
    imports: [
        IconField,
        InputText,
        Image,
        Button,
        RouterLink,
        Select,
        FormsModule,
        InputText,
        Select,
        // Textarea,
        Button,
        RouterLink,
        Image
    ],
})
export class Plan {
    selectedWorkouts: WorkoutDto[] = Array(7).fill(null);
    planName: string = '';
    workoutlist: WorkoutDto[] = [];
    selected: boolean = false;
    current: boolean = false;


    constructor(
        private workoutFacade: WorkoutFacade,
        private router: Router,
        private planFacade: PlanFacade
    ) {
        this.workoutFacade.fetchAllWorkouts();

        this.workoutFacade.workoutState$.subscribe(workouts => {
            this.workoutlist = workouts.sort((a, b) => a.name.localeCompare(b.name));
            console.log('Workouts loaded for dropdowns:', this.workoutlist);
        });
    }

    isRestSelected(index: number): boolean {
        return this.selectedWorkouts[index]?.name === 'Rest';
    }

    selectWorkout(index: number) {
        console.log('Selected workout at index', index);
        // Handle selection logic if needed (e.g., mark it as chosen)
    }



    goToWorkout(index: number) {
        const workout = this.selectedWorkouts[index];
        if (workout?.id) {
            this.router.navigate(['/menu/workout'], { queryParams: { id: workout.id } });
        }
    }

            savePlan() {
        const selectedIds: (string | undefined)[] = this.selectedWorkouts.map(w => w?.id);

        if (selectedIds.includes(undefined)) {
            // Notify the user that they must select all workouts
            alert('Please select a workout for each day before saving.');
            return; // stop the save
        }

        const plan: PlanDto = {
            id: '',
            name: this.planName,
            workoutIds: selectedIds as string[],
            selected: this.selected,
            current: this.current
        };

        console.log('Saving plan:', plan);

        this.planFacade.createPlan(plan).subscribe({
            next: () => {
                console.log('Plan saved successfully');
                this.router.navigate(['/']);
            },
            error: (err: any) => {
                console.error('Failed to save plan', err);
            }
        });
    }
}
