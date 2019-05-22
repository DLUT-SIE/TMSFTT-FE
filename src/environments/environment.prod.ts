import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  // TODO(youchen): Replace with production server.
  CAS_LOGIN_URL: 'https://test.feingst.com/mock-cas/login/',
  SERVICE_URL: 'https://test.feingst.com/auth/login/',
  WHITE_LIST_DOMAINS: [],
  API_URL: '/api',
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30 * 1000,
};
