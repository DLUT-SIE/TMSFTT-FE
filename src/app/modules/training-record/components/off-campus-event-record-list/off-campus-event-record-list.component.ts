import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordResponse } from 'src/app/interfaces/record';
import { RecordService } from '../../services/record.service';
import { GenericListComponent } from 'src/app/generics/generic-list/generic-list';

@Component({
  selector: 'app-off-campus-event-record-list',
  templateUrl: './off-campus-event-record-list.component.html',
  styleUrls: ['./off-campus-event-record-list.component.css']
})
export class OffCampusEventRecordListComponent extends GenericListComponent<RecordResponse> {

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly recordService: RecordService,
  ) {
    super(route, router);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map<string, string>();
    extraParams.set('off_campus_event__isnull', 'false');
    return this.recordService.getRecords({offset, limit, extraParams});
  }

  navigateToForm() {
    this.router.navigate(['.', 'record-form'], { relativeTo: this.route });
  }

}
