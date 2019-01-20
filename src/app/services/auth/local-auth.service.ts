import { Injectable, Inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth-service';
import { WindowService } from '../window.service';
import { STORAGE_SERVICE, StorageService } from '../storage/storage-service';

/** LocalAuthService stubs all authentication logic during development. */
@Injectable({
  providedIn: 'root'
})
export class LocalAuthService implements AuthService {
  isAuthenticated = false;
  userID = null;
  username = null;
  firstName = null;
  lastName = null;

  constructor(
    private readonly windowService: WindowService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) { }

  login() {
    return timer(100).subscribe(() => {
      const url = `${environment.SERVICE_URL}?ticket=123&service_url=123`;
      this.windowService.redirect(url);
    });
  }

  private authenticate() {
    this.userID = 123;
    this.username = 'username';
    this.firstName = 'first_name';
    this.lastName = 'last_name';
    this.storageService.setItem(environment.JWT_KEY, 'test-token');
    this.isAuthenticated = true;
  }

  retrieveJWT(ticket: string, serviceURL: string): Observable<boolean> {
    return timer(100).pipe(
      map(() => {
        if (ticket === 'invalid') {
          return false;
        }
        this.authenticate();
        return true;
      }));
  }

  private obtainJWT() {
    return timer(100).pipe(map(() => {
      const token = this.storageService.getItem(environment.JWT_KEY);
      if (!token || token === 'invalid') {
        this.isAuthenticated = false;
        return false;
      }
      this.authenticate();
      return true;
    }));
  }

  verifyJWT() {
    return this.obtainJWT();
  }

  refreshJWT() {
    return this.obtainJWT();
  }
}
