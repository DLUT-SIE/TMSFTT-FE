interface Event {
  id?: number;
  create_time?: string;
  update_time?: string;
  name?: string;
  time?: string;
  location?: string;
  num_hours?: number;
  num_participants?: number;
}

// tslint:disable-next-line:no-empty-interface
export interface OffCampusEvent extends Event {
}

export interface CampusEvent extends Event {
  program?: number;
  deadline?: string;
  num_enrolled?: number;
  description?: string;
}
