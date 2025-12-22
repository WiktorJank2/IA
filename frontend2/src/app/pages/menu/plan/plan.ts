import { Component } from '@angular/core';
import {IconField} from "primeng/iconfield";
import {InputText} from "primeng/inputtext";
import {Image} from "primeng/image";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Select} from "primeng/select";
import {FormsModule} from "@angular/forms";
import {Textarea} from "primeng/textarea";

@Component({
  selector: 'app-workout',
    imports: [
        IconField,
        InputText,
        Image,
        Button,
        RouterLink,
        Select,
        FormsModule,
        InputText,
        Select,
        // Textarea,
        FormsModule,
        Button,
        RouterLink,
        Image
    ],
  templateUrl: './plan.html',
  styleUrl: './plan.scss'
})
export class Plan {
    simplicityR = [
        { name: '1/5', code: 'Option 1' },
        { name: '2/5', code: 'Option 2' },
        { name: '3/5', code: 'Option 3' },
        { name: '4/5', code: 'Option 2' },
        { name: '5/5', code: 'Option 2' },
    ];

    dropdownItem = null;

}
