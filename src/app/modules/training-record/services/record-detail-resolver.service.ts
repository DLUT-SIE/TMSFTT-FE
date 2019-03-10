import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { RecordService } from './record.service';
import { RecordResponse } from 'src/app/interfaces/record';

@Injectable({
  providedIn: 'root'
})
export class RecordDetailResolverService implements Resolve< RecordResponse > {

  constructor(
    private readonly recordService: RecordService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RecordResponse> {
    const id = +route.paramMap.get('id');
    return this.recordService.getRecord(id);
  }
}
