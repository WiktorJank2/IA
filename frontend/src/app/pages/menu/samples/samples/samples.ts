import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Plan {
    id: string;
    name: string;
    workoutIds: string[];
    selected: boolean;
    current: boolean;
}

@Component({
    selector: 'app-samples',
    standalone: true,
    templateUrl: './samples.html',
    imports: [
        TableModule,
        RouterLink,
        ButtonModule,
        IconField,
        InputIcon,
        InputTextModule,
        CheckboxModule,
        CommonModule,
        FormsModule
    ]
})
export class Samples implements OnInit {
    // Reference to PrimeNG table instance
    @ViewChild('dt1') dt1!: Table;

    // Plans displayed in the table
    plans: PlanDto[] = [];

    // Controls loading state of the table
    loading = false;

    // ID of the rest workout used for filtering
    private restWorkoutId = '318ce03f-b09f-4407-9cf2-2c2d011e8ab1';

    constructor(
        private planFacade: PlanFacade,
        private router: Router
    ) {}

    // Loads plans from the facade and keeps local copy sorted
    ngOnInit() {
        this.loading = true;

        this.planFacade.planState$.subscribe(plansFromFacade => {
            this.plans = [...plansFromFacade].sort(
                (a, b) => (b.selected ? 1 : 0) - (a.selected ? 1 : 0)
            );
            this.loading = false;
        });

        this.planFacade.fetchAllPlans();
    }

    // Navigates to the selected plan view
    openPlan(planId: string) {
        this.router.navigate(['/menu/plan'], { queryParams: { id: planId } });
    }

    // Applies global text filtering to the table
    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(value, 'contains');
    }

    // Counts workouts excluding the rest workout
    getActiveWorkoutCount(plan: Plan): number {
        if (!plan.workoutIds) return 0;

        return plan.workoutIds.filter(
            id => id !== this.restWorkoutId
        ).length;
    }

    // Clears all table filters
    clear() {
        this.dt1.clear();
    }

    // Persists all plans to the backend
    savePlan() {
        if (!this.plans || this.plans.length === 0) return;

        for (const plan of this.plans) {
            this.planFacade.updatePlan(plan.id!, plan).subscribe({
                next: returnedPlan => {
                    const index = this.plans.findIndex(p => p.id === returnedPlan.id);
                    if (index !== -1) {
                        this.plans[index] = returnedPlan;
                    }
                }
            });
        }
    }

    // Updates selected state when checkbox is toggled
    onCheckboxChange(event: any, plan: PlanDto) {
        const index = this.plans.findIndex(p => p.id === plan.id);
        if (index === -1) return;

        this.plans[index] = {
            ...plan,
            selected: event.checked
        };
    }
}
