import { Component } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputText } from 'primeng/inputtext';
import { Image } from 'primeng/image';
import { Button } from 'primeng/button';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

import { WorkoutFacade } from '@/pages/service/workout/workout.facade';
import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { PlanService } from '@/pages/service/plan/plan.service';
import { WorkoutService } from '@/pages/service/workout/workout.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-plan',
    standalone: true,
    templateUrl: './plan.html',
    styleUrls: ['./plan.scss'],
    imports: [
        IconField,
        InputText,
        Image,
        Button,
        RouterLink,
        Select,
        FormsModule
    ],
})
export class Plan {
    planId?: string;
    planName: string = '';
    selectedWorkouts: WorkoutDto[] = Array(7).fill(null);
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
        // Fetch all workouts for dropdown selection
        this.workoutFacade.fetchAllWorkouts();
        this.workoutFacade.workoutState$.subscribe(workouts => {
            this.workoutlist = workouts.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    // Check if a selected workout is a "Rest" day
    isRestSelected(index: number): boolean {
        return this.selectedWorkouts[index]?.name === 'Rest';
    }

    // Navigate to selected workout details
    goToWorkout(index: number) {
        const workout = this.selectedWorkouts[index];
        if (workout?.id) {
            this.router.navigate(['/menu/workout'], { queryParams: { id: workout.id } });
        }
    }

    // Load plan if an ID exists in query params
    ngOnInit(): void {
        const idParam = this.route.snapshot.queryParamMap.get('id');
        if (idParam) {
            this.planId = idParam;
            this.loadPlan(this.planId);
        } else {
            this.initializeEmptyPlan();
        }
    }

    // Fetch plan details and populate workouts
    private loadPlan(id: string) {
        this.planService.getById(id).subscribe({
            next: (planDto: PlanDto) => {
                if (!planDto.workoutIds || planDto.workoutIds.length === 0) {
                    this.initializeEmptyPlan();
                    return;
                }
                const requests = planDto.workoutIds.map(workoutId =>
                    this.workoutService.getWorkoutById(workoutId)
                );
                forkJoin(requests).subscribe({
                    next: (workouts: WorkoutDto[]) => this.fillForm(planDto, workouts)
                });
            }
        });
    }

    // Populate form fields with fetched plan and workouts
    private fillForm(planDto: PlanDto, workouts: WorkoutDto[]) {
        this.planName = planDto.name;
        this.selectedWorkouts = workouts;
    }

    // Initialize a new empty plan with 7 days
    private initializeEmptyPlan() {
        this.selectedWorkouts = new Array(7).fill(null);
    }

    // Save or update the plan
    savePlan() {
        const selectedIds: (string | undefined)[] = this.selectedWorkouts.map(w => w?.id);

        // Ensure all days have a selected workout
        if (selectedIds.includes(undefined)) {
            alert('Please select a workout for each day before saving.');
            return;
        }

        const plan: PlanDto = {
            id: this.planId ?? '',
            name: this.planName,
            workoutIds: selectedIds as string[],
            selected: this.selected,
            current: this.current
        };

        if (this.planId) {
            this.planFacade.updatePlan(this.planId, plan).subscribe();
        } else {
            this.planFacade.createPlan(plan).subscribe(newPlan => {
                this.planId = newPlan.id;
            });
        }
    }
    selectWorkout(index: number) {
        console.log('Selected workout at index', index);
    } // Handle selection logic if needed (e.g., mark it as chosen)
}
