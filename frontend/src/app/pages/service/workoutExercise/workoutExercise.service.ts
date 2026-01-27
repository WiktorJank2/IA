import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WorkoutExerciseDto } from '@/pages/service/workoutExercise/workoutExercise.model';


@Injectable({
    providedIn: 'root'
})
export class WorkoutExerciseService {
    private readonly apiUrl = 'http://localhost:8080/workout-exercises'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<WorkoutExerciseDto[]> {
        return this.http.get<WorkoutExerciseDto[]>(this.apiUrl);
    }

    getById(id: string): Observable<WorkoutExerciseDto> {
        return this.http.get<WorkoutExerciseDto>(this.apiUrl + '/' + id);
    }

    create(exercise: Omit<WorkoutExerciseDto, 'id'>): Observable<WorkoutExerciseDto> {
        return this.http.post<WorkoutExerciseDto>(this.apiUrl, exercise);
    }

    update(id: string, exercise: WorkoutExerciseDto): Observable<WorkoutExerciseDto> {
        return this.http.put<WorkoutExerciseDto>(this.apiUrl + '/' + id, exercise);
    }

    delete(id: string): Observable<WorkoutExerciseDto> {
        return this.http.delete<WorkoutExerciseDto>(this.apiUrl + '/' + id);
    }

    getWorkoutExercisesByWorkoutId(id: string): Observable<WorkoutExerciseDto[]> {
        return this.http.get<WorkoutExerciseDto[]>(`http://localhost:8080/workout-exercises/workout/${id}`);
    }


    createMany(workoutExerciseDtos: WorkoutExerciseDto[]) {
        return this.http.post<WorkoutExerciseDto[]>(this.apiUrl + '/many', workoutExerciseDtos);
    }
}
