import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  CAS_LOGIN_URL: 'http://127.0.0.1:8000/mock-cas/login/',
  SERVICE_URL: 'http://127.0.0.1:8000/auth/login/',
  WHITE_LIST_DOMAINS: ['127.0.0.1:8000',],
  API_URL: '/api',
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30 * 1000,
};
