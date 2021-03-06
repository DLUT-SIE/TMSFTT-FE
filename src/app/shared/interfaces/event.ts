import { Program } from './program';
import { Coefficient } from './coefficient';

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
  program?: number | Program;
  deadline?: string;
  num_enrolled?: number;
  description?: string;
  expired?: boolean;
  enrolled?: boolean;
  enrollment_id?: number;
  reviewed?: boolean;
  program_detail?: Program;
  coefficients?: Coefficient[];
}
