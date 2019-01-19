import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


/** This interface is a mapping to the definition of CampusEvent on server. */
export interface CampusEvent {
  name: string;
  time: string;
  location: string;
  num_hours: number;
  num_participants: number;
  num_enrolled: number|null;
  description: string|null;
}

/** This interface is a mapping to the definition of OffCampusEvent on server. */
export interface OffCampusEvent {
  id?: number;
  name: string;
  time: string;
  location: string;
  num_hours: number;
  num_participants: number;
}

/** Provide services for Event. */
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  createOffCampusEvent(event: OffCampusEvent) {
    return this.http.post(environment.OFF_CAMPUS_EVENT_SERVICE_URL, event);
  }

  deleteOffCampusEvent(eventID: number) {
    return this.http.delete(environment.OFF_CAMPUS_EVENT_SERVICE_URL + eventID + '/');
  }
}
