import { Routes } from '@angular/router';
import { Workout } from '@/pages/menu/workout/workout';
import {Exercise} from "@/pages/menu/exercise/exercise/exercise";
import {Samples} from "@/pages/menu/samples/samples/samples";
import {MyPlans} from "@/pages/menu/my-plans/my-plans";
import {Plan} from "@/pages/menu/plan/plan";



export default [
    { path: 'workout', data: { breadcrumb: 'Create Workout' }, component: Workout },
    { path: 'plan', data: { breadcrumb: 'Create Plan' }, component: Plan },
    { path: 'exercise', data: { breadcrumb: 'Create Exercise' }, component: Exercise },
    { path: 'samples', data: { breadcrumb: 'Sample Plans' }, component: Samples },
    { path: 'my-plans', data: { breadcrumb: 'My Plans' }, component: MyPlans },
    { path: '**', redirectTo: '/notfound' },
    {
        path: 'plan/:id',
        component: Plan
    },

] as Routes;
