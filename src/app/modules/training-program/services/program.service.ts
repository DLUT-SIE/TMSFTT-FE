import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ProgramDetail } from 'src/app/interfaces/program';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';


@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  /** How often should we query latest programforms. */

  constructor(
    private readonly http: HttpClient,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {
    this.authService.authenticationSucceed.subscribe(() => {
    });
  }

  getPrograms(offset?: number, limit?: number) {
    if (offset === undefined) offset = 0;
    if (limit === undefined) limit = environment.PAGINATION_SIZE;
    const paramsObj = { offset, limit };
    const queryParams = Object.keys(paramsObj).map(
      key => key + '=' + encodeURIComponent(paramsObj[key])).join('&');
    let url = environment.API_URL + '/programs/';
    url += '?' + queryParams;
    return this.http.get<PaginatedResponse<ProgramDetail>>(url);
  }
}