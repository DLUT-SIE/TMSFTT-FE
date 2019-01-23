import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NotificationService } from './notification.service';
import { NotificationResponse } from 'src/app/interfaces/notification';

/** Pre-fetching notification data. */
@Injectable({
  providedIn: 'root'
})
export class NotificationDetailResolverService implements Resolve<NotificationResponse> {

  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NotificationResponse> {
    const id = +route.paramMap.get('id');
    return this.notificationService.getNotification(id);
  }
}
