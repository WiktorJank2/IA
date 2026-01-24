import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Exercise } from './menu/exercise/exercise/exercise';
import { Workout } from './menu/workout/workout';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'exercise', component: Exercise },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },
    { path: 'menu/workout/:id', component: Workout }
] as Routes;
