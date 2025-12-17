import {Component, ElementRef, ViewChild} from '@angular/core';
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputIcon, InputIconModule} from "primeng/inputicon";
import {InputText, InputTextModule} from "primeng/inputtext";
import {Button, ButtonDirective, ButtonModule} from "primeng/button";
import {RouterLink} from "@angular/router";
import {AutoComplete, AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {FormsModule} from "@angular/forms";
import {CommonModule, CurrencyPipe, DatePipe} from "@angular/common";
import {ProgressBar, ProgressBarModule} from "primeng/progressbar";
import {Select, SelectModule} from "primeng/select";
import {Slider, SliderModule} from "primeng/slider";
import {Table, TableModule} from "primeng/table";
import {Tag, TagModule} from "primeng/tag";
import {MultiSelectModule} from "primeng/multiselect";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ToastModule} from "primeng/toast";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService, MessageService} from "primeng/api";
import {Customer, CustomerService} from "@/pages/service/customer.service";
import {ProductService} from "@/pages/service/product.service";
import {Image} from "primeng/image";

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-plan',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,

        TableModule,
        InputTextModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        TagModule,
        ProgressBarModule,
        SliderModule,
        SelectModule,
        MultiSelectModule,
        ToggleButtonModule,
        ToastModule,
        RatingModule,
        RippleModule,

        RouterLink,
        CurrencyPipe,
        DatePipe,
        AutoComplete,
        Image
    ],
    templateUrl: './workout.html',
    styleUrl: './workout.scss',
    providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Workout {
    customers1: Customer[] = [];

    statuses: any[] = [];

    activityValues: number[] = [0, 100];

    loading: boolean = true;

    selectedAutoValue: any = null;

    autoFilteredValue: any[] = [];

    autoValue: any[] | undefined;

    @ViewChild('filter') filter!: ElementRef;

    constructor(
        private customerService: CustomerService,
        private productService: ProductService
    ) {
    }
    filterCountry(event: AutoCompleteCompleteEvent) {
        const filtered: any[] = [];
        const query = event.query;

        for (let i = 0; i < (this.autoValue as any[]).length; i++) {
            const country = (this.autoValue as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.autoFilteredValue = filtered;
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

