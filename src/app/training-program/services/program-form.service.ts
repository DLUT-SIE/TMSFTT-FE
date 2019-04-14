import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProgramForm } from 'src/app/shared/interfaces/program-form';

import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

@Injectable({
  providedIn: 'root'
})
export class ProgramFormService extends GenericListService {

  constructor(
    protected readonly http: HttpClient,
  ) {
      super(http);
    }

  /* get program-forms from background**/
  getProgramForms(req: ListRequest) {
    return this.list<ProgramForm>('program-forms', req);
  }
}
