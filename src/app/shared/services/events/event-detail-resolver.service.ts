import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { EventService } from './event.service';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { switchMap, map } from 'rxjs/operators';
import { Program } from '../../interfaces/program';

/** Pre-fetching notification data. */
@Injectable({
  providedIn: 'root'
})
export class EventDetailResolverService implements Resolve<CampusEvent> {
  event: CampusEvent;

  constructor(
    private readonly eventService: EventService,
    private readonly programService: ProgramService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CampusEvent > {
    const id = +route.paramMap.get('id');
    return this.eventService.getEvent(id).pipe(
      switchMap((data: CampusEvent) => {
        this.event = data;
        return this.programService.getProgram(this.event.program as number);
      }),
      map((program: Program) => {
        this.event.program = program;
        return this.event;
      }),
    );
  }
}
