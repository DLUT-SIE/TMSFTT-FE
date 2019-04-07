import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordResponse } from 'src/app/interfaces/record';
import { RecordService } from 'src/app/modules/training-record/services/record.service';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

/** Display a list of Records. */
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent extends GenericListComponent<RecordResponse> {
  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly recordService: RecordService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    return this.recordService.getRecords({offset, limit});
  }

}
