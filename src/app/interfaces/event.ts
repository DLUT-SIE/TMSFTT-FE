interface Event {
  name: string;
  time: string;
  location: string;
  num_hours: number;
  num_participants: number;
}

// tslint:disable-next-line:no-empty-interface
interface OffCampusEvent extends Event {
}

interface CampusEvent extends Event {
  num_enrolled: number;
  deadline: string;
  description: string;
}

/** RESTful request interface for CampusEvent. */
// tslint:disable-next-line:no-empty-interface
export interface CampusEventRequest extends CampusEvent {
}

/** RESTful response interface for CampusEvent. */
export interface CampusEventResponse extends CampusEvent {
  id: number;
}

/** RESTful request interface for OffCampusEvent. */
// tslint:disable-next-line:no-empty-interface
export interface OffCampusEventRequest extends OffCampusEvent {
}

/** RESTful response interface for OffCampusEvent. */
export interface OffCampusEventResponse extends OffCampusEvent {
  id: number;
}

