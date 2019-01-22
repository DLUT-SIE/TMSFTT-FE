// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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

export const environment: Environment = {
  production: false,
  JWT_KEY: 'ACCESS_TOKEN',
  JWT_VERIFY_URL: 'http://localhost:8000/api/auth/jwt-verify/',
  JWT_REFRESH_URL: 'http://localhost:8000/api/auth/jwt-refresh/',
  CAS_LOGIN_URL: 'http://localhost:8000/mock-cas/login/',
  CAS_VERIFY_URL: 'http://localhost:8000/api/auth/login/',
  SERVICE_URL: 'http://localhost:4200/auth/login/',
  WHITE_LIST_DOMAINS: ['localhost:4200', 'localhost:8000'],
  RECORD_SERVICE_URL: 'http://localhost:8000/api/training-record/records/',
  RECORD_CONTENT_SERVICE_URL: 'http://localhost:8000/api/training-record/record-contents/',
  RECORD_ATTACHMENT_SERVICE_URL: 'http://localhost:8000/api/training-record/record-attachments/',
  OFF_CAMPUS_EVENT_SERVICE_URL: 'http://localhost:8000/api/training-event/off-campus-events/',
  NOTIFICATION_SERVICE_URL: 'http://localhost:8000/api/infra/notifications/',
  PAGINATION_SIZE: 10,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
