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
import { Route } from '@angular/router';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { PlanService } from '@/pages/service/plan/plan.service';
import { WorkoutService } from '@/pages/service/workout/workout.service';

import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

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
    planId?: string;
    selectedWorkouts: WorkoutDto[] = Array(7).fill(null);
    planName: string = '';
    workoutlist: WorkoutDto[] = [];
    selected: boolean = false;
    current: boolean = false;


    constructor(
        private workoutFacade: WorkoutFacade,
        private router: Router,
        private route: ActivatedRoute,
        private planFacade: PlanFacade,
        private planService: PlanService,
        private workoutService: WorkoutService
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

    ngOnInit(): void {
        const idParam = this.route.snapshot.queryParamMap.get('id'); // use queryParamMap
        console.log('Plan ID from query param:', idParam);

        if (idParam) {
            this.planId = idParam;       // UUID string
            this.loadPlan(this.planId);
        } else {
            console.log('No plan ID in query parameters');
            this.initializeEmptyPlan();
        }
    }

    private loadPlan(id: string) {
        console.log('Loading plan with ID:', id);

        this.planService.getById(id).subscribe({
            next: (planDto: PlanDto) => {
                console.log('Plan DTO from backend:', planDto);

                if (!planDto.workoutIds || planDto.workoutIds.length === 0) {
                    console.log('No workouts in plan');
                    this.initializeEmptyPlan();
                    return;
                }

                const requests = planDto.workoutIds.map(workoutId => {
                    console.log('Fetching workout with ID:', workoutId);
                    return this.workoutService.getWorkoutById(workoutId);
                });

                forkJoin(requests).subscribe({
                    next: (workouts: WorkoutDto[]) => {
                        console.log('Fetched workouts:', workouts);
                        this.fillForm(planDto, workouts);
                    },
                    error: err => console.error('Error fetching workouts:', err)
                });
            },
            error: err => console.error('Error fetching plan:', err)
        });
    }

    private fillForm(planDto: PlanDto, workouts: WorkoutDto[]) {
        console.log('Filling form with plan and workouts...');
        this.planName = planDto.name;
        this.selectedWorkouts = workouts;
        console.log('planName:', this.planName);
        console.log('selectedWorkouts:', this.selectedWorkouts);
    }


    private initializeEmptyPlan() {
        // Default 7 days with no workouts
        this.selectedWorkouts = new Array(7).fill(null);
    }

    goToWorkout(index: number) {
        const workout = this.selectedWorkouts[index];
        if (workout?.id) {
            this.router.navigate(['/menu/workout'], { queryParams: { id: workout.id } });
        }
    }

    savePlan() {
        const selectedIds: (string | undefined)[] = this.selectedWorkouts.map(w => w?.id);

        // Validation: make sure no workout is undefined
        if (selectedIds.includes(undefined)) {
            alert('Please select a workout for each day before saving.');
            return;
        }

        const plan: PlanDto = {
            id: this.planId ?? '',           // use existing ID for updates
            name: this.planName,
            workoutIds: selectedIds as string[],
            selected: this.selected,
            current: this.current
        };

        console.log('Saving plan:', plan);

        if (this.planId) {
            // Existing plan → update
            this.planFacade.updatePlan(this.planId, plan).subscribe({
                next: () => {
                    console.log('Plan updated successfully');
                },
                error: (err: any) => {
                    console.error('Failed to update plan', err);
                }
            });
        } else {
            // New plan → create
            this.planFacade.createPlan(plan).subscribe({
                next: (newPlan: PlanDto) => {
                    console.log('Plan created successfully', newPlan);
                    this.planId = newPlan.id;  // save the new UUID so future edits update
                },
                error: (err: any) => {
                    console.error('Failed to save plan', err);
                }
            });
        }
    }
}
