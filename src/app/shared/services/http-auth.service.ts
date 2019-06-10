import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { timer, Observable, of as ObservableOf, ReplaySubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { environment } from 'src/environments/environment';
import { JWTResponse, AuthService } from '../interfaces/auth-service';
import { WindowService } from 'src/app/shared/services/window.service';
import { StorageService, STORAGE_SERVICE } from '../interfaces/storage-service';


/** Provide authentication service during the app lifetime. */
@Injectable({
  providedIn: 'root'
})
export class HTTPAuthService implements AuthService {
  isAuthenticated = false;
  isSchoolAdmin = false;
  isDepartmentAdmin = false;
  isTeacher = false;
  userID: number = null;
  username: string = null;
  firstName: string = null;
  lastName: string = null;
  department: number = null;
  departmentName: string = null;
  administrativeDepartment: number = null;
  administrativeDepartmentName: string = null;
  authenticationSucceed = new ReplaySubject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly windowService: WindowService,
    private readonly cookieService: CookieService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) { }

  /** Redirect user to CAS login page. */
  login(nextURL?: string) {
    // Remove any query parameters in next URL.
    const questionMarkPos = nextURL.indexOf('?');
    if (questionMarkPos !== -1) {
      nextURL = nextURL.slice(0, questionMarkPos);
    }
    const queryParams = {
      service: `${environment.SERVICE_URL}?next=${nextURL}`,
    };
    const payload = Object.entries(queryParams).map(([k, v]) =>
      `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    timer(500).subscribe(() => {
      this.windowService.redirect(`${environment.CAS_LOGIN_URL}?${payload}`);
    });
  }

  logout() {
    this.deauthenticate();
  }

  /** Extract necessary information from data and set fields of service. */
  private authenticate(response: JWTResponse) {
    const token = response.token;
    const user = response.user;
    this.userID = user.id;
    this.username = user.username;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.isSchoolAdmin = user.is_school_admin;
    this.isDepartmentAdmin = user.is_department_admin;
    this.isTeacher = user.is_teacher;
    this.department = user.department;
    this.departmentName = user.department_str || '未知';
    this.administrativeDepartment = user.administrative_department;
    this.administrativeDepartmentName = user.administrative_department_str || '未知';
    this.storageService.setItem(environment.JWT_KEY, token);
    this.isAuthenticated = true;
    this.authenticationSucceed.next();
  }

  /** Remove JWT in all storages and set boolean field to false. */
  private deauthenticate() {
    this.cookieService.delete(environment.JWT_KEY);
    this.storageService.removeItem(environment.JWT_KEY);
    this.isAuthenticated = false;
  }

  /** Retrieve the JWT given ticket and service. */
  retrieveJWT(ticket: string): Observable<boolean> {
    const payload = { ticket, service: environment.SERVICE_URL };
    return this.http.post<JWTResponse>(
      `/login/`, payload).pipe(
      map(response => {
        this.authenticate(response);
        return true;
      }),
      catchError(() => {
        this.deauthenticate();
        return ObservableOf(false);
      }),
    );
  }

  private sendJWT(obtainURL: string) {
    const token = this.storageService.getItem(environment.JWT_KEY);
    if (!token) return ObservableOf(false);
    const payload = { token };
    return this.http.post<JWTResponse>(obtainURL, payload).pipe(
      map(response => {
        this.authenticate(response);
        return true;
      }),
      catchError(() => {
        this.deauthenticate();
        return ObservableOf(false);
      }),
    );
  }

  /* Request server to verify the JWT. */
  verifyJWT(): Observable<boolean> {
    return this.sendJWT(`/jwt-verify/`);
  }

  /* Request server to refresh the JWT. */
  refreshJWT(): Observable<boolean> {
    return this.sendJWT(`/jwt-refresh/`);
  }
}
