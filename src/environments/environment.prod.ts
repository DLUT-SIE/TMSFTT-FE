import { Environment } from './environment';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  JWT_VERIFY_URL: 'not-set',
  JWT_REFRESH_URL: 'not-set',
  CAS_LOGIN_URL: 'not-set',
  CAS_VERIFY_URL: 'not-set',
  SERVICE_URL: 'not-set',
  WHITE_LIST_DOMAINS: [],
  RECORD_SERVICE_URL: 'not-set',
  RECORD_CONTENT_SERVICE_URL: 'not-set',
  RECORD_ATTACHMENT_SERVICE_URL: 'not-set',
  OFF_CAMPUS_EVENT_SERVICE_URL: 'not-set',
};
