/** RESTful reponse interface for Review-Note. */
export interface ReviewNote {
  id?: number;
  create_time?: string;
  record?: number;
  user?: number;
  user_name?: string;
  content?: string;
}
