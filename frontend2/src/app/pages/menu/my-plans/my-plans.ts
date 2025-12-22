import {Component, ElementRef, ViewChild} from '@angular/core';
import {ButtonDirective, ButtonModule} from "primeng/button";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputIcon, InputIconModule} from "primeng/inputicon";
import {InputText, InputTextModule} from "primeng/inputtext";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";
import {Select, SelectModule} from "primeng/select";
import {Slider, SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
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
    customers1: Customer[] = [];

    statuses: any[] = [];

    activityValues: number[] = [0, 100];

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private customerService: CustomerService,
        private productService: ProductService
    ) {
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }
}
