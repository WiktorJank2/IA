import {ElementRef} from '@angular/core';
import {ButtonDirective, ButtonModule} from "primeng/button";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputIcon, InputIconModule} from "primeng/inputicon";
import {InputText, InputTextModule} from "primeng/inputtext";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";
import {Select, SelectModule} from "primeng/select";
import {Slider, SliderModule} from "primeng/slider";
import {Tag, TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ToastModule} from "primeng/toast";
import {FormsModule} from "@angular/forms";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService} from "primeng/api";
import {Customer, CustomerService} from "@/pages/service/customer.service";
import {ProductService} from "@/pages/service/product.service";
import {RouterLink, Router} from "@angular/router";
import { Component, ViewChild, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Plan } from '../samples/samples/samples';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
  selector: 'app-my-plans',
    standalone: true,
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule,
        RouterLink,
        CheckboxModule,
        RadioButtonModule
    ],
  templateUrl: './my-plans.html',
  styleUrl: './my-plans.scss',
  providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class MyPlans {
    @ViewChild('dt1') dt1!: Table;

    statuses: any[] = [];

    selectedPlan: PlanDto | null = null;

    plans: PlanDto[] = [];
    loading = false;
    selectedPlans: PlanDto[] = [];
    currentPlanId: string | null = null;
    currentId: string | null = null;

    constructor(
        private customerService: CustomerService,
        private productService: ProductService,
        private planFacade: PlanFacade,
        private router: Router
    ) {
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

    openPlan(planId: string) {  // planId is string if your array is string[]
       this.router.navigate(['/menu/plan'], { queryParams: { id: planId } });

    }

    onCurrentChange(selectedPlan: PlanDto) {
        this.currentPlanId = selectedPlan.id!;

        this.selectedPlans = this.selectedPlans.map(plan => ({
            ...plan,
            current: plan.id === selectedPlan.id
        }));
    }

    savePlan() {
        console.log('Plans at save time:', this.selectedPlans);

        if (!this.selectedPlans) {
            console.log('plans is undefined');
            return;
        }

        if (this.selectedPlans.length === 0) {
            console.log('plans array is empty');
            return;
        }

        for (let plan of this.selectedPlans) {
            this.planFacade.updatePlan(plan.id!, plan).subscribe({
                next: () => console.log('Plan saved:', plan.id),
                error: err => console.error('Failed to save plan', plan.id, err)
            });
        }
    }

    clear() {
        this.dt1.clear();
    }
    ngOnInit() {
        this.planFacade.planState$.subscribe(plans => {
            this.selectedPlans = plans.filter(plan => plan.selected === true);
        });

        const current = this.plans.find(p => p.current);
        this.currentId = current ? current.id! : null;

        const currentPlan = this.selectedPlans.find(p => p.current === true);
        this.currentPlanId = currentPlan ? currentPlan.id! : null;

        this.planFacade.fetchAllPlans();
    }


}
