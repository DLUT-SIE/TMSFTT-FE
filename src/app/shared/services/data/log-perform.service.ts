import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { PaginatedResponse } from '../../interfaces/paginated-response';
import { LogData } from 'src/app/shared/interfaces/log';

/** Provide services for Log Perform. */
@Injectable({
  providedIn: 'root'
})
export class LogPerformService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
    super(http);
  }

  getLogs(req: ListRequest) {
    return this.list<PaginatedResponse<LogData>>(`log-perform`, req);
  }
}
