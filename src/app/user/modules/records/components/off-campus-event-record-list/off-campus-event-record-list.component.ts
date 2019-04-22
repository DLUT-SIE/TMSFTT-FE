import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Record } from 'src/app/shared/interfaces/record';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

@Component({
  selector: 'app-off-campus-event-record-list',
  templateUrl: './off-campus-event-record-list.component.html',
  styleUrls: ['./off-campus-event-record-list.component.css']
})
export class OffCampusEventRecordListComponent extends GenericListComponent<Record> {

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly recordService: RecordService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map<string, string>();
    extraParams.set('off_campus_event__isnull', 'false');
    return this.recordService.getRecords({offset, limit, extraParams});
  }

  navigateToForm() {
    this.router.navigate(['.', 'form'], { relativeTo: this.route });
  }

}
