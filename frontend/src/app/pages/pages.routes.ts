import { Routes } from '@angular/router';
import { Exercise } from './menu/exercise/exercise/exercise';
import { Workout } from './menu/workout/workout';

export default [
    { path: 'exercise', component: Exercise },
    { path: '**', redirectTo: '/notfound' },
    { path: 'menu/workout/:id', component: Workout }
] as Routes;
