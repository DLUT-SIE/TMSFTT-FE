import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  CAS_LOGIN_URL: 'not-set',
  SERVICE_URL: 'not-set',
  WHITE_LIST_DOMAINS: [],
  API_URL: 'not-set',
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30 * 1000,
};
