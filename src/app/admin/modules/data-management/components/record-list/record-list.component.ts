import { Component} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/user/modules/records/services/record.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

/** Display a list of Records. */
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent extends GenericListComponent<Record> {
  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly recordService: RecordService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    return this.recordService.getRecords({offset, limit});
  }

}
