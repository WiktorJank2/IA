import { Component } from '@angular/core';
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {Textarea} from "primeng/textarea";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Image} from "primeng/image";

@Component({
  selector: 'app-exercise',
    imports: [
        InputText,
        Select,
        Textarea,
        FormsModule,
        Button,
        RouterLink,
        Image
    ],
  templateUrl: './exercise.html',
  styleUrl: './exercise.scss'
})
export class Exercise {

    simplicityR = [
        { name: '1/5', code: 'Option 1' },
        { name: '2/5', code: 'Option 2' },
        { name: '3/5', code: 'Option 3' },
        { name: '4/5', code: 'Option 2' },
        { name: '5/5', code: 'Option 2' },
    ];
    effectivenessR = [
        { name: '1/5', code: 'Option 1' },
        { name: '2/5', code: 'Option 2' },
        { name: '3/5', code: 'Option 3' },
        { name: '4/5', code: 'Option 2' },
        { name: '5/5', code: 'Option 2' },
    ];
    overallR = [
        { name: '1/5', code: 'Option 1' },
        { name: '2/5', code: 'Option 2' },
        { name: '3/5', code: 'Option 3' },
        { name: '4/5', code: 'Option 2' },
        { name: '5/5', code: 'Option 2' },
    ];

    dropdownItem = null;

}
