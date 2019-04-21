import { ContentType } from '../enums/content-type.enum';

/** Interface for RecordContent. */
export interface RecordContent {
  id?: number;
  create_time?: string;
  update_time?: string;
  record?: number;
  /** The type of this content. */
  content_type?: ContentType;
  /** The value of thie content. */
  content?: string;
}

