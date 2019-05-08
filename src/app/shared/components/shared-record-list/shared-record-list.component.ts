import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Record } from 'src/app/shared/interfaces/record';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { RecordListType } from '../../enums/record-list-type.enum';
import { RecordStatus } from 'src/app/shared/enums/record-status.enum';

@Component({
  selector: 'app-shared-record-list',
  templateUrl: './shared-record-list.component.html',
  styleUrls: ['./shared-record-list.component.css']
})
export class SharedRecordListComponent extends GenericListComponent<Record> {
  @Input() recordListType?: RecordListType;
  warnStatus: Set<RecordStatus> = new Set([
    RecordStatus.STATUS_FEEDBACK_REQUIRED,
    RecordStatus.STATUS_SCHOOL_ADMIN_REJECTED,
    RecordStatus.STATUS_DEPARTMENT_ADMIN_REJECTED,
  ]);
  primaryStatus: Set<RecordStatus> = new Set([
    RecordStatus.STATUS_FACULTY_ADMIN_REVIEWED,
    RecordStatus.STATUS_FEEDBACK_SUBMITED,
    RecordStatus.STATUS_SUBMITTED,
    RecordStatus.STATUS_PRESUBMIT,
  ]);
  disabledStatus: Set<RecordStatus> = new Set([
    RecordStatus.STATUS_SCHOOL_ADMIN_REVIEWED,
    RecordStatus.STATUS_CLOSED,
  ]);
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
