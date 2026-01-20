import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { PlanDto } from '@/pages/service/plan/plan.model';
import { PlanService } from '@/pages/service/plan/plan.service';

@Injectable({
    providedIn: 'root'
})
export class PlanFacade {
    planState$ = new BehaviorSubject<PlanDto[]>([])
    planByIdState$ = new BehaviorSubject<PlanDto | null>(null)

    constructor(private planService: PlanService) {
    }

    fetchAllPlans(): void {
        this.planService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.planState$.next(x)
                })
            )
            .subscribe()
    }
    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<PlanDto> {
        // clear any previous value so UI doesn't show stale patient
        this.planByIdState$.next(null);

        return this.planService.getById(id).pipe(
            take(1),
            tap(x => this.planByIdState$.next(x))
        );
    }

    createPlan(plan: PlanDto): Observable<PlanDto> {
        return this.planService.create(plan).pipe(
            take(1),
            tap(newPlan => {
                // add the new plan to planState$
                const currentPlans = this.planState$.getValue();
                this.planState$.next([...currentPlans, newPlan]);

                // set the new plan in planByIdState$
                this.planByIdState$.next(newPlan);
            })
        );
    }
    updatePlan(id: string, plan: PlanDto): Observable<PlanDto> {
        return this.planService.update(id, plan).pipe(
            take(1),
            tap(updatedPlan => {
                // Update the planByIdState$ if it matches the updated plan
                const currentPlan = this.planByIdState$.getValue();
                if (currentPlan && currentPlan.id === updatedPlan.id) {
                    this.planByIdState$.next(updatedPlan);
                }
                // Optionally, refresh the full list of plans
                this.fetchAllPlans();
            })
        );
    }

    setPlanSelected(planId: string, selected: boolean) {
        return this.planService.setSelected(planId, selected);
    }

    deletePlan(id: string): Observable<PlanDto> {
        return this.planService.delete(id).pipe(
            take(1),
            tap(() => {
                // remove the plan from planState$
                const currentPlans = this.planState$.getValue();
                const updatedPlans = currentPlans.filter(p => p.id !== id);
                this.planState$.next(updatedPlans);

                // clear planByIdState$ if it matches the deleted plan
                const currentPlanById = this.planByIdState$.getValue();
                if (currentPlanById && currentPlanById.id === id) {
                    this.planByIdState$.next(null);
                }
            })
        );
    }
}
