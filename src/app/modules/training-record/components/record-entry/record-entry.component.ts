import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordResponse } from 'src/app/interfaces/record';
import { RecordService } from '../../services/record.service';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

@Component({
  selector: 'app-record-entry',
  templateUrl: './record-entry.component.html',
  styleUrls: ['./record-entry.component.css']
})
export class RecordEntryComponent extends GenericListComponent<RecordResponse> {

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly recordService: RecordService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('off_campus_events__isnull', false);
    return this.recordService.getRecords({offset, limit, extraParams});
  }

  navigateToForm() {
    this.router.navigate(['.','record-form'], { relativeTo: this.route });
  }

}
