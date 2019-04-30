import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Environment } from 'src/environments/environment.interface';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  environment(): Environment {
    return environment;
  }

  getProduction(): boolean {
    return environment.production;
  }

  getApiUrl(): string {
    return environment.API_URL;
  }

  getHost(): string {
    return environment.HOST;
  }

  getJwtKey(): string {
    return environment.JWT_KEY;
  }

  getCasLoginUrl(): string {
    return environment.CAS_LOGIN_URL;
  }

  getServiceUrl(): string {
    return environment.SERVICE_URL;
  }

  getWhiteListDomains(): string[] {
    return environment.WHITE_LIST_DOMAINS;
  }

  getPaginationSize(): number {
    return environment.PAGINATION_SIZE;
  }

  getRefreshInterval(): number {
    return environment.REFRESH_INTERVAL;
  }
}
