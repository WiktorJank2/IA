import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {IconField, IconFieldModule} from "primeng/iconfield";
import {InputIcon, InputIconModule} from "primeng/inputicon";
import {InputText, InputTextModule} from "primeng/inputtext";
import {Table, TableModule} from "primeng/table";
import {Tag, TagModule} from "primeng/tag";
import {Country, Customer, CustomerService, Representative} from "@/pages/service/customer.service";
import {Product, ProductService} from "@/pages/service/product.service";
import {ConfirmationService, MessageService, TreeNode} from "primeng/api";
import {MultiSelectModule} from "primeng/multiselect";
import {SelectModule} from "primeng/select";
import {SliderModule} from "primeng/slider";
import {ProgressBarModule} from "primeng/progressbar";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ToastModule} from "primeng/toast";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {RouterLink} from "@angular/router";

interface expandedRows {
    [key: string]: boolean;
}

@Component({
  selector: 'app-samples',
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
  templateUrl: './samples.html',
  styleUrl: './samples.scss',
  providers: [ConfirmationService, MessageService, CustomerService, ProductService]
})
export class Samples {
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





