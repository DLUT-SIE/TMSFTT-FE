import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Record } from 'src/app/shared/interfaces/record';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { RecordListType } from '../../enums/record-list-type.enum';

@Component({
  selector: 'app-shared-record-list',
  templateUrl: './shared-record-list.component.html',
  styleUrls: ['./shared-record-list.component.css']
})
export class SharedRecordListComponent extends GenericListComponent<Record> {
  @Input() recordListType?: RecordListType;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly recordService: RecordService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    let url = 'records';
    switch (this.recordListType) {
      case RecordListType.ALL_RECORDS: {
        return this.recordService.getRecordsWithDetail(url, {offset, limit});
      }
      case RecordListType.REVIEWED_RECORDS: {
        url = 'records/reviewed';
        return this.recordService.getRecordsWithDetail(url, {offset, limit});
      }
      case RecordListType.OFF_CAMPUS_EVENT_RECORDS: {
        const extraParams = new Map<string, string>();
        extraParams.set('off_campus_event__isnull', 'false');
        return this.recordService.getRecordsWithDetail(url, {offset, limit, extraParams});
      }
      default: {
        return this.recordService.getRecordsWithDetail(url, {offset, limit});
      }
    }
  }
}
