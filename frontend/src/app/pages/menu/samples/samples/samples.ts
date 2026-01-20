import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';



interface Plan {
    workoutIds?: { name: string }[];
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

    constructor(private planFacade: PlanFacade) {}

    ngOnInit() {
        this.loading = true;

        // Subscribe to facade, but copy values locally
        this.planFacade.planState$.subscribe(plansFromFacade => {
            this.plans = [...plansFromFacade]; // new array for UI
            this.loading = false;
        });

        // Trigger initial fetch
        this.planFacade.fetchAllPlans();
    }


    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(value, 'contains');
    }

    getActiveWorkoutCount(plan: any): number {
        let count = 0;

        if (!plan.workouts) {
            return 0;
        }

        for (const id of plan.workoutIds) {
            if (id !== this.restWorkoutId) {
                count++;
            }
        }

        return count;
    }

    clear() {
        this.dt1.clear();
    }


    onCheckboxChange(event: any, plan: PlanDto) {
        const checked = event.checked;

        const index = this.plans.findIndex(p => p.id === plan.id);
        if (index === -1) return;

        // 1️⃣ Optimistically update local array
        this.plans[index] = { ...plan, selected: checked };

        // 2️⃣ Update backend via facade
        this.planFacade.setPlanSelected(plan.id!, checked).subscribe({
            error: () => {
                // Rollback if server fails
                this.plans[index] = { ...plan, selected: !checked };
            }
        });
    }
}
