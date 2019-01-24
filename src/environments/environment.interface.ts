/** The runtime settings that are used across all components. */
export interface Environment {
  /** The runtime mode for the app */
  production: boolean;
  /**
   * The key of the JWT that should be used to store the information about
   * JWT in Storage.
   */
  JWT_KEY: string;
  /** The URL that corresponding to the server to verify the JWT. */
  JWT_VERIFY_URL: string;
  /** The URL that corresponding to the server to refresh the JWT. */
  JWT_REFRESH_URL: string;
  /**
   * The CAS server URL that verify the user and return a CAS ticke
   * to be verified.
   */
  CAS_LOGIN_URL: string;
  /**
   * The CAS client URL that verify the CAS ticket issued by CAS server and
   * return a JWT.
   */
  CAS_VERIFY_URL: string;
  /** The URL that should be used to receive the CAS ticket. */
  SERVICE_URL: string;
  /** The authorization header will be set for requests to these domains. */
  WHITE_LIST_DOMAINS: string[];
  /** How many items in one page. */
  PAGINATION_SIZE: number;

  /** Below are services endpoints. */
  RECORD_SERVICE_URL: string;
  RECORD_CONTENT_SERVICE_URL: string;
  RECORD_ATTACHMENT_SERVICE_URL: string;
  OFF_CAMPUS_EVENT_SERVICE_URL: string;
  NOTIFICATION_SERVICE_URL: string;
}

