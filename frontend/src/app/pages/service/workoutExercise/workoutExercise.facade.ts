import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { WorkoutExerciseDto } from '@/pages/service/workoutExercise/workoutExercise.model';
import { WorkoutExerciseService } from '@/pages/service/workoutExercise/workoutExercise.service';

@Injectable({
    providedIn: 'root'
})
export class WorkoutExerciseFacade {
    workoutExerciseState$ = new BehaviorSubject<WorkoutExerciseDto[]>([])
    workoutExerciseByIdState$ = new BehaviorSubject<WorkoutExerciseDto | null>(null)

    constructor(private workoutExerciseService: WorkoutExerciseService) {
    }

    fetchAllWorkoutExercises(): void {
        this.workoutExerciseService.getAll().subscribe(data => {
            console.log('Data from backend:', data);
        });
        this.workoutExerciseService.getAll()

            .pipe(
                take(1),
                tap(x => {
                    this.workoutExerciseState$.next(x)
                })
            )
            .subscribe()
    }
    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<WorkoutExerciseDto> {
        // clear any previous value so UI doesn't show stale patient
        this.workoutExerciseByIdState$.next(null);

        return this.workoutExerciseService.getById(id).pipe(
            take(1),
            tap(x => this.workoutExerciseByIdState$.next(x))
        );
    }

    createWorkoutExercise(workoutExercise: WorkoutExerciseDto): Observable<WorkoutExerciseDto> {
        return this.workoutExerciseService.create(workoutExercise).pipe(
            take(1),
            tap(newWorkoutExercise => {
                // add the new workoutExercise to workoutExerciseState$
                const currentWorkoutExercises = this.workoutExerciseState$.getValue();
                this.workoutExerciseState$.next([...currentWorkoutExercises, newWorkoutExercise]);

                // set the new workoutExercise in workoutExerciseByIdState$
                this.workoutExerciseByIdState$.next(newWorkoutExercise);
            })
        );
    }
    updateWorkoutExercise(id: string, workoutExercise: WorkoutExerciseDto): Observable<WorkoutExerciseDto> {
        return this.workoutExerciseService.update(id, workoutExercise).pipe(
            take(1),
            tap(updatedWorkoutExercise => {
                // Update the workoutExerciseByIdState$ if it matches the updated workoutExercise
                const currentWorkoutExercise = this.workoutExerciseByIdState$.getValue();
                if (currentWorkoutExercise && currentWorkoutExercise.id === updatedWorkoutExercise.id) {
                    this.workoutExerciseByIdState$.next(updatedWorkoutExercise);
                }
                // Optionally, refresh the full list of workoutExercises
                this.fetchAllWorkoutExercises();
            })
        );
    }

    deleteWorkoutExercise(id: string): Observable<WorkoutExerciseDto> {
        return this.workoutExerciseService.delete(id).pipe(
            take(1),
            tap(() => {
                // remove the workoutExercise from workoutExerciseState$
                const currentWorkoutExercises = this.workoutExerciseState$.getValue();
                const updatedWorkoutExercises = currentWorkoutExercises.filter(p => p.id !== id);
                this.workoutExerciseState$.next(updatedWorkoutExercises);

                // clear workoutExerciseByIdState$ if it matches the deleted workoutExercise
                const currentWorkoutExerciseById = this.workoutExerciseByIdState$.getValue();
                if (currentWorkoutExerciseById && currentWorkoutExerciseById.id === id) {
                    this.workoutExerciseByIdState$.next(null);
                }
            })
        );
    }
    getById(id: string) {
        return this.workoutExerciseService.getById(id);
    }

    createWorkoutExercises(workoutExerciseDtos: WorkoutExerciseDto[]) {
        this.workoutExerciseService.createMany(workoutExerciseDtos)
        .pipe(
            take(1),
            tap(x => this.workoutExerciseState$.next(x))
        )
        .subscribe()
    }
}
