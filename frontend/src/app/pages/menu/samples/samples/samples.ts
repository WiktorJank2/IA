import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
    selector: 'app-samples',
    imports: [
        TableModule,
        RouterLink,
        Button,
        TableModule,
        IconField,
        InputIcon,
        IconField,
        IconField,
        InputIcon,
        IconField
    ],
    templateUrl: './samples.html'
})
export class Samples implements OnInit {
    @ViewChild('dt1') dt1!: Table;

    plans: PlanDto[] = [];
    loading = true;

    constructor(private planFacade: PlanFacade) {}

    ngOnInit() {
        this.planFacade.fetchAllPlans(); // fetch from backend

        this.planFacade.planState$.subscribe(plans => {
            this.plans = plans;
            this.loading = false;
            console.log('Plans from backend:', plans);
        });
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.dt1.filterGlobal(value, 'contains');
    }

    clear() {
        this.dt1.clear();
    }
}
