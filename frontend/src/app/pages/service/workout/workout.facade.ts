import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';

import { WorkoutDto } from '@/pages/service/workout/workout.model';
import { WorkoutService } from '@/pages/service/workout/workout.service';
import { ExerciseFacade } from '@/pages/service/exercise/exercise.facade';


@Injectable({
    providedIn: 'root'
})
export class WorkoutFacade {
    workoutState$ = new BehaviorSubject<WorkoutDto[]>([])
    workoutByIdState$ = new BehaviorSubject<WorkoutDto | null>(null)

    constructor(private workoutService: WorkoutService) {}

    fetchAllWorkouts(): void {
        this.workoutService.getAll()
            .pipe(
                take(1),
                tap(x => {
                    this.workoutState$.next(x)
                })
            )
            .subscribe()
    }
    // return the HTTP observable and update the BehaviorSubject
    fetchById(id: string): Observable<WorkoutDto> {
        // clear any previous value so UI doesn't show stale patient
        this.workoutByIdState$.next(null);

        return this.workoutService.getById(id).pipe(
            take(1),
            tap(x => this.workoutByIdState$.next(x))
        );
    }

    createWorkout(workout: WorkoutDto): Observable<WorkoutDto> {
        return this.workoutService.create(workout).pipe(
            take(1),
            tap(newWorkout => {
                // add the new workout to workoutState$
                const currentWorkouts = this.workoutState$.getValue();
                this.workoutState$.next([...currentWorkouts, newWorkout]);

                // set the new workout in workoutByIdState$
                this.workoutByIdState$.next(newWorkout);
            })
        );
    }
    updateWorkout(id: string, workout: WorkoutDto): Observable<WorkoutDto> {
        return this.workoutService.update(id, workout).pipe(
            take(1),
            tap(updatedWorkout => {
                // Update the workoutByIdState$ if it matches the updated workout
                const currentWorkout = this.workoutByIdState$.getValue();
                if (currentWorkout && currentWorkout.id === updatedWorkout.id) {
                    this.workoutByIdState$.next(updatedWorkout);
                }
                // Optionally, refresh the full list of workouts
                this.fetchAllWorkouts();
            })
        );
    }

    deleteWorkout(id: string): Observable<WorkoutDto> {
        return this.workoutService.delete(id).pipe(
            take(1),
            tap(() => {
                // remove the workout from workoutState$
                const currentWorkouts = this.workoutState$.getValue();
                const updatedWorkouts = currentWorkouts.filter(p => p.id !== id);
                this.workoutState$.next(updatedWorkouts);

                // clear workoutByIdState$ if it matches the deleted workout
                const currentWorkoutById = this.workoutByIdState$.getValue();
                if (currentWorkoutById && currentWorkoutById.id === id) {
                    this.workoutByIdState$.next(null);
                }
            })
        );
    }
}
