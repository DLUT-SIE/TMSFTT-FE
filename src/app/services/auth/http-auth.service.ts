import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { timer, Observable, of as ObservableOf } from 'rxjs';
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
  userID = null;
  username = null;
  firstName = null;
  lastName = null;

  constructor(
    private readonly http: HttpClient,
    private readonly windowService: WindowService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) { }

  /** Redirect user to CAS login page. */
  login() {
    const queryParams = {
      service: environment.SERVICE_URL,
    };
    const payload = Object.entries(queryParams).map(([k, v]) =>
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    timer(500).subscribe(() => {
      this.windowService.redirect(`${environment.CAS_LOGIN_URL}?${payload}`);
    });
  }

  /** Extract necessary information from data and set fields of service. */
  private authenticate(data: {}) {
    const token = data['token'];
    const user = data['user'];
    this.userID = user['id'];
    this.username = user['username'];
    this.firstName = user['first_name'];
    this.lastName = user['last_name'];
    this.storageService.setItem(environment.JWT_KEY, token);
    this.isAuthenticated = true;
  }

  /** Retrieve the JWT given ticket and serviceURL. */
  retrieveJWT(ticket: string, serviceURL: string): Observable<boolean> {
    const payload = {
      ticket,
      service_url: serviceURL,
    };
    return this.http.post(environment.CAS_VERIFY_URL, payload).pipe(
      map(data => {
        this.authenticate(data);
        return true;
      }),
      catchError(() => {
        this.isAuthenticated = false;
        return ObservableOf(false);
      }),
    );
  }

  private sendJWT(obtainURL: string) {
    const token = this.storageService.getItem(environment.JWT_KEY);
    if (!token) return ObservableOf(false);
    const payload = { token };
    return this.http.post(obtainURL, payload).pipe(
      map(data => {
        this.authenticate(data);
        return true;
      }),
      catchError(() => {
        this.isAuthenticated = false;
        return ObservableOf(false);
      }),
    );
  }

  /* Request server to verify the JWT. */
  verifyJWT(): Observable<boolean> {
    return this.sendJWT(environment.JWT_VERIFY_URL);
  }

  /* Request server to refresh the JWT. */
  refreshJWT(): Observable<boolean> {
    return this.sendJWT(environment.JWT_REFRESH_URL);
  }
}
