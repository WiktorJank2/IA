import { Component } from '@angular/core';
import {Panel} from "primeng/panel";
import {Splitter} from "primeng/splitter";
import {Button} from "primeng/button";
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {Toolbar} from "primeng/toolbar";
import {Image} from "primeng/image";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home-page',
    imports: [
        Panel,
        Splitter,
        Button,
        IconField,
        InputIcon,
        InputText,
        // Toolbar,
        Image,
        RouterLink
    ],
    standalone: true,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage {

}
