import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { Notification } from 'src/app/shared/interfaces/notification';

/** Pre-fetching notification data. */
@Injectable({
  providedIn: 'root'
})
export class NotificationDetailResolverService implements Resolve<Notification> {

  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Notification> {
    const id = +route.paramMap.get('id');
    return this.notificationService.getNotification(id);
  }
}
