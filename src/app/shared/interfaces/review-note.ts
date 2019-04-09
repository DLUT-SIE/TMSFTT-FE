/** RESTful request interface for Review-Note. */
export interface ReviewNoteRequest {
  content: string;
  record: number;
  user: number;
}

/** RESTful reponse interface for Review-Note. */
export interface ReviewNoteResponse {
  id: number;
  create_time: string;
  content: string;
  record: number;
  user: number;
}
