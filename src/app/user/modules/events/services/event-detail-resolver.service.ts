import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { EventService } from './event.service';
import { CampusEvent } from 'src/app/shared/interfaces/event';
/** Pre-fetching notification data. */
@Injectable({
  providedIn: 'root'
})
export class EventDetailResolverService implements Resolve<CampusEvent> {

  constructor(
    private readonly eventService: EventService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CampusEvent > {
    const id = +route.paramMap.get('id');
    return this.eventService.getEvent(id);
  }
}
