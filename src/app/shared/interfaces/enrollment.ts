import { User } from './user';

/** RESTful reponse interface for Enrollment. */
export interface Enrollment {
    id?: number;
    create_time?: string;
    enroll_method?: number;
    campus_event?: number;
    user?: number | User;
  }
