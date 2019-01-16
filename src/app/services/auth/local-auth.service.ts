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

  constructor(
    private readonly windowService: WindowService,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) { }

  login() {
    return timer(1000).subscribe(() => {
      const url = `${environment.SERVICE_URL}?ticket=123&service_url=123`;
      this.windowService.redirect(url);
    });
  }

  retrieveJWT(ticket: string, serviceURL: string): Observable<boolean> {
    return timer(1000).pipe(
      map(() => {
        if (ticket === 'invalid') {
          return false;
        }
        this.storageService.setItem(environment.JWT_KEY, 'test-jwt');
        return true;
      }));
  }

  private obtainJWT() {
    return timer(1000).pipe(map(() => {
      const token = this.storageService.getItem(environment.JWT_KEY);
      if (!token || token === 'invalid') {
        return false;
      }
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
