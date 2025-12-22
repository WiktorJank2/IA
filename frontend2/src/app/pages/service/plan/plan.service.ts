import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PlanDto } from '@/pages/service/plan/plan.model';

@Injectable({
    providedIn: 'root'
})
export class PlanService {

    private readonly apiUrl = 'http://localhost:8080/plans'; // backend url

    constructor(private http: HttpClient) {}

    getAll(): Observable<PlanDto[]> {
        return this.http.get<PlanDto[]>(this.apiUrl);
    }

    getById(id: string): Observable<PlanDto> {
        return this.http.get<PlanDto>(this.apiUrl + '/' + id);
    }

    create(plan: Omit<PlanDto, 'id'>): Observable<PlanDto> {
        return this.http.post<PlanDto>(this.apiUrl, plan);
    }

    update(id: string, plan: PlanDto): Observable<PlanDto> {
        return this.http.put<PlanDto>(this.apiUrl + '/' + id, plan);
    }

    delete(id: string): Observable<PlanDto> {
        return this.http.delete<PlanDto>(this.apiUrl + '/' + id);
    }
}
