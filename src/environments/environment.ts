// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { Environment } from './environment.interface';


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
