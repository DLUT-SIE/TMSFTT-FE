import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  // TODO(youchen): Replace with production server.
  CAS_LOGIN_URL: 'http://localhost:8000/mock-cas/login/',
  SERVICE_URL: 'http://localhost:8000/auth/login/',
  WHITE_LIST_DOMAINS: ['localhost:8000'],
  API_URL: 'http://localhost:8000/api',
  HOST: "http://localhost:8000",
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30 * 1000,
};
