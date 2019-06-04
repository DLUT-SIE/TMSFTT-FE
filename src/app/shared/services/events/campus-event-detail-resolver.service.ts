import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { EventService } from './event.service';
import { CampusEvent } from 'src/app/shared/interfaces/event';

/** Pre-fetching campus event detail data. */
@Injectable({
  providedIn: 'root'
})
export class CampusEventDetailResolverService implements Resolve<CampusEvent> {
  event: CampusEvent;

  constructor(
    private readonly eventService: EventService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CampusEvent > {
    const id = +route.paramMap.get('event_id');
    return this.eventService.getEvent(id);
  }
}
