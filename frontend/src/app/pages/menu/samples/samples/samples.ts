import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { RouterLink, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgModule } from '@angular/core';
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
    imports: [
        TableModule,
        RouterLink,
        Button,
        ButtonModule,
        TableModule,
        IconField,
        InputIcon,
        InputIcon,
        IconField,
        Checkbox,
        Checkbox,
        CommonModule,
        FormsModule,      // <-- needed for [(ngModel)]
        CheckboxModule
    ],
    standalone: true,
    templateUrl: './samples.html'

})


export class Samples implements OnInit {
    @ViewChild('dt1') dt1!: Table;



    plans: PlanDto[] = [];
    loading = false;
    private restWorkoutId= '318ce03f-b09f-4407-9cf2-2c2d011e8ab1';

    constructor(private planFacade: PlanFacade, private router: Router) {}

    ngOnInit() {
        this.loading = true;

        // Subscribe to facade, but copy values locally
        this.planFacade.planState$.subscribe(plansFromFacade => {
            this.plans = [...plansFromFacade]
                .sort((a, b) => (b.selected ? 1 : 0) - (a.selected ? 1 : 0)); // selected first
            this.loading = false;
        });

        // Trigger initial fetch
        this.planFacade.fetchAllPlans();
    }

    openPlan(planId: string) {  // planId is string if your array is string[]
        this.router.navigate(['/menu/plan'], { queryParams: { id: planId } });
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(value, 'contains');
    }

    getActiveWorkoutCount(plan: Plan): number {
        let count = 0;

        if (!plan.workoutIds) {
            return 0;
        }

        for (const id of plan.workoutIds) {
            if (id !== '2f998760-10be-4bf8-8363-770d8f40eb19') {
                count++;
            }
        }

        return count;
    }

    clear() {
        this.dt1.clear();
    }

    savePlan() {
        if (!this.plans || this.plans.length === 0) {
            console.log('No plans to save');
            return;
        }

        for (let plan of this.plans) {
            console.log('Saving plan:', plan.id, plan.selected);

            this.planFacade.updatePlan(plan.id!, plan).subscribe({
                next: (returnedPlan) => {
                    // Update local state with what the backend actually saved
                    const index = this.plans.findIndex(p => p.id === returnedPlan.id);
                    if (index !== -1) {
                        this.plans[index] = returnedPlan;
                    }
                    console.log('Plan saved:', returnedPlan.id);
                },
                error: (err) => {
                    console.error('Failed to save plan', plan.id, err);
                }
            });
        }
    }

    onCheckboxChange(event: any, plan: PlanDto) {
        const checked = event.checked;

        const index = this.plans.findIndex(p => p.id === plan.id);
        if (index === -1) return;
        console.log('Updating plan:', plan.id, plan);
        // Update the local plan.selected only
        this.plans[index] = { ...plan, selected: checked };
    }

}
