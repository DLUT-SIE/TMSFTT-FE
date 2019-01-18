import { Injectable } from '@angular/core';


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

  constructor() { }
}
