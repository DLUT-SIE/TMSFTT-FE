import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProgramCategory } from 'src/app/shared/interfaces/program-category';

import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

@Injectable({
  providedIn: 'root'
})
export class ProgramCategoryService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
      super(http);
    }

  /* get program-categories from background**/
  getProgramCategories(req: ListRequest) {
    return this.list<ProgramCategory>('program-categories', req);
  }
}
