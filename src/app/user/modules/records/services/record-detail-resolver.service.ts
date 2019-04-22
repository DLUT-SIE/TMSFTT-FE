import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { RecordService } from './record.service';
import { Record } from 'src/app/shared/interfaces/record';

/** Pre-fetching record data. */
@Injectable({
  providedIn: 'root'
})
export class RecordDetailResolverService implements Resolve< Record > {

  constructor(
    private readonly recordService: RecordService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Record> {
    const id = +route.paramMap.get('id');
    return this.recordService.getRecord(id);
  }
}
