import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { timer, Observable, of as ObservableOf, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth-service';
import { WindowService } from '../window.service';
import { StorageService, STORAGE_SERVICE } from '../storage/storage-service';


/** Provide authentication service during the app lifetime. */
@Injectable({
  providedIn: 'root'
})
export class HTTPAuthService implements AuthService {
  isAuthenticated = false;

  constructor(
    private readonly http: HttpClient,
    private readonly windowService: WindowService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
    ) { }

  /** Redirect user to CAS login page. */
  login() {
    const queryParams = {
        'service': environment.SERVICE_URL,
    };
    const payload = Object.entries(queryParams).map(([k, v]) =>
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    timer(500).subscribe(() => {
      this.windowService.redirect(`${environment.CAS_LOGIN_URL}?${payload}`);
    });
  }

  /** Retrieve the JWT given ticket and serviceURL. */
  retrieveJWT(ticket: string, serviceURL: string): Observable<boolean> {
    const payload = {
      'ticket': ticket,
      'service_url': serviceURL,
    };
    return this.http.post(environment.CAS_VERIFY_URL, payload).pipe(
      map(val => {
        const token = val['token'];
        this.storageService.setItem(environment.JWT_KEY, token);
        this.isAuthenticated = true;
        return true;
      }),
      catchError(() => ObservableOf(false)),
    );
  }

  private sendJWT(obtainURL: string) {
    const token = this.storageService.getItem(environment.JWT_KEY);
    if (!token) return throwError('No JWT presetned.');
    const payload = {
      'token': token,
    };
    return this.http.post(obtainURL, payload);
  }

  /* Request server to verify the JWT. */
  verifyJWT(): Observable<boolean> {
    return this.sendJWT(environment.JWT_VERIFY_URL).pipe(
      map(() => true),
      catchError(() => ObservableOf(false)),
    );
  }

  /* Request server to refresh the JWT. */
  refreshJWT(): Observable<boolean> {
    return this.sendJWT(environment.JWT_REFRESH_URL).pipe(
      map(data => {
        const token = data['token'];
        localStorage.setItem(environment.JWT_KEY, token);
        return true;
      }),
      catchError(() => ObservableOf(false)),
    );
  }
}
