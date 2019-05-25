import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  constructor(
    private readonly http: HttpClient,
  ) { }

  getPersonalSummary() {
    return this.http.get('/aggregate-data/data/?method_name=personal_summary');
  }

  getSchoolSummary() {
    return this.http.get('/aggregate-data/data/?method_name=school_summary');
  }
}
