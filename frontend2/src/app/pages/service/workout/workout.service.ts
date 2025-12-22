import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { WorkoutDto } from '@/pages/service/workout/workout.model';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    private readonly apiUrl = 'http://localhost:8080/workouts'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<WorkoutDto[]> {
        return this.http.get<WorkoutDto[]>(this.apiUrl);
    }

    getById(id: string): Observable<WorkoutDto> {
        return this.http.get<WorkoutDto>(this.apiUrl + '/' + id);
    }

    create(workout: Omit<WorkoutDto, 'id'>): Observable<WorkoutDto> {
        return this.http.post<WorkoutDto>(this.apiUrl, workout);
    }

    update(id: string, workout: WorkoutDto): Observable<WorkoutDto> {
        return this.http.put<WorkoutDto>(this.apiUrl + '/' + id, workout);
    }

    delete(id: string): Observable<WorkoutDto> {
        return this.http.delete<WorkoutDto>(this.apiUrl + '/' + id);
    }
}
