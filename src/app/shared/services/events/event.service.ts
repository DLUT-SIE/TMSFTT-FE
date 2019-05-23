import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  OffCampusEvent,
  CampusEvent,
} from 'src/app/shared/interfaces/event';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { PaginatedResponse } from '../../interfaces/paginated-response';
import { Enrollment } from 'src/app/shared/interfaces/enrollment';
import { RoundChoice } from 'src/app/shared/interfaces/round-choice';
import { tap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService extends GenericListService {

  private cachedRoundChoices: RoundChoice[] = [];

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getEvent(id: number) {
    return this.http.get<CampusEvent>(
      `/campus-events/${id}/`);
  }

  /** Retrieve campus events. */
  /** TODO(youchen): Rename this function */
  getCampusEvents(req: ListRequest) {
    return this.list<PaginatedResponse<CampusEvent>>('campus-events', req);
  }

  /** Create an off-campus event. */
  createOffCampusEvent(req: OffCampusEvent) {
    return this.http.post<OffCampusEvent>(
      `/off-campus-events/`, req);
  }

  /** Delete the off-campus event based on eventID. */
  deleteOffCampusEvent(eventID: number) {
    return this.http.delete(
      `/off-campus-events/${eventID}/`);
  }

  getOffCampusEvent(eventID: number) {
    return this.http.get<OffCampusEvent>(
      `/off-campus-events/${eventID}/`);
  }

  /** Retrieve off-campus events, it's frequently used in AutoComplete. */
  getOffCampusEvents(req: ListRequest) {
    return this.list<PaginatedResponse<OffCampusEvent>>('off-campus-events', req);
  }

  /**  Admin create campus event */
  createCampusEvent(req: CampusEvent) {
    return this.http.post<CampusEvent>(
      `/campus-events/`, req);
  }

 /** Update campus event */
  updateCampusEvent(req: CampusEvent) {
    return this.http.patch<CampusEvent>(
      `/campus-events/${req.id}/`, req);
  }

  /** Enroll campus event */
  enrollCampusEvent(event: CampusEvent): Observable<Enrollment> {
    return this.http.post<Enrollment>(
      `/enrollments/`, {campus_event: event.id});
  }

  /** Delete campus event enrollment. */
  deleteEventEnrollment(id: number) {
    return this.http.delete(`/enrollments/${id}/`);
  }

  /** Get round choices. */
  getRoundChoices() {
    if (this.cachedRoundChoices.length !== 0) {
      return observableOf(this.cachedRoundChoices);
    }
    return this.http.get<RoundChoice[]>(`/round-choices/`).pipe(
      tap(data => this.cachedRoundChoices = data),
    );
  }

}
