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
import {RouterLink} from "@angular/router";
import { Component, ViewChild, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { PlanFacade } from '@/pages/service/plan/plan.facade';
import { PlanDto } from '@/pages/service/plan/plan.model';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
  selector: 'app-my-plans',
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
        RouterLink
    ],
  templateUrl: './my-plans.html',
  styleUrl: './my-plans.scss',
  providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class MyPlans {
    @ViewChild('dt1') dt1!: Table;

    statuses: any[] = [];


    plans: PlanDto[] = [];
    loading = false;


    constructor(
        private customerService: CustomerService,
        private productService: ProductService,
        private planFacade: PlanFacade
    ) {
    }

    onGlobalFilter(event: Event) {
        this.dt1.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear() {
        this.dt1.clear();
    }
    ngOnInit() {
        this.loadMyPlans();
    }

    loadMyPlans() {
        this.loading = true;

        this.planFacade.fetchAllPlans()

        this.planFacade.planState$.subscribe({
            next: (plans) => {
                this.plans = plans.filter(p => p.selected === true);
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Failed to load plans', err);
                this.loading = false;
            }
        });
    }
}
