import { Injectable, Inject } from '@angular/core';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { of as observableOf } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    private readonly http: HttpClient,
  ) { }

  getPersonalSummary() {
    if (!this.authService.isAuthenticated) {
      return observableOf(null);
    }
    return this.http.get('/aggregate-data/data/?method_name=personal_summary');
  }
}
