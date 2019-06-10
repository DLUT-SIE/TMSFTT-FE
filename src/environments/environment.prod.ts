import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  JWT_KEY: 'ACCESS_TOKEN',
  CAS_LOGIN_URL: 'https://sso.dlut.edu.cn/cas/login',
  SERVICE_URL: 'http://ctfdpeixun.dlut.edu.cn/auth/login/',
  WHITE_LIST_DOMAINS: [],
  API_URL: '/api',
  PAGINATION_SIZE: 10,
  REFRESH_INTERVAL: 30 * 1000,
};
