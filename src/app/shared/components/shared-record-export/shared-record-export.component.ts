import { Component, Input } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Record } from 'src/app/shared/interfaces/record';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { WindowService } from 'src/app/shared/services/window.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { errorProcess } from 'src/app/shared/utils/error-process';
import { RecordExportType } from 'src/app/shared/enums/record-export-type.enum';
import { RecordStatus } from '../../enums/record-status.enum';

@Component({
  selector: 'app-shared-record-export',
  templateUrl: './shared-record-export.component.html',
  styleUrls: ['./shared-record-export.component.css']
})
export class SharedRecordExportComponent extends GenericListComponent<Record> {
  readonly RecordExportType = RecordExportType;

  @Input() recordExportType?: RecordExportType;
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


  filterForm = this.fb.group({
    userName: [''],
    eventName: [''],
    location: [''],
    startTime: [''],
    endTime: [''],
  });

  readonly datePipe: DatePipe = new DatePipe('zh-Hans');

  valueToExport: {
    userName: string,
    eventName: string,
    location: string,
    startTime: Date,
    endTime: Date,
  };

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly recordService: RecordService,
    private readonly windowService: WindowService,
    private readonly snackBar: MatSnackBar,
    private readonly loggerService: LoggerService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const value = this.filterForm.value;
    this.valueToExport = value;
    const params = new Map<string, string>([
      ['user__username', value.userName],
      ['event_name', value.eventName],
      ['event_location', value.location],
      ['start_time', value.startTime ? this.datePipe.transform(value.startTime, 'yyyy-MM-dd') : value.startTime],
      ['end_time', value.endTime ? this.datePipe.transform(value.endTime, 'yyyy-MM-dd') : value.endTime],
    ]);
    if (this.recordExportType === RecordExportType.EXPORT_FOR_USER) {
      params.delete('user__username');
    }
    return this.recordService.getRecords('records', {offset, limit, extraParams: params});
  }

  buildUrl(): string {
        let url = `/aggregate-data/table-export/?table_type=8`;
        if (this.valueToExport.userName && this.recordExportType === RecordExportType.EXPORT_FOR_ADMIN) {
          url += `&user__username=${this.valueToExport.userName}`;
        }
        if (this.valueToExport.eventName) {
          url += `&event_name=${this.valueToExport.eventName}`;
        }
        if (this.valueToExport.location) {
          url += `&event_location=${this.valueToExport.location}`;
        }
        if (this.valueToExport.startTime) {
          url += `&start_time=${this.datePipe.transform(this.valueToExport.startTime, 'yyyy-MM-dd')}`;
        }
        if (this.valueToExport.endTime) {
          url += `&end_time=${this.datePipe.transform(this.valueToExport.endTime, 'yyyy-MM-dd')}`;
        }
        return url;
    }

  doResultsExport() {
    this.recordService.exportRecords(this.buildUrl()).subscribe(
      data => {
          this.windowService.open(data['url']);
          this.snackBar.open('导出成功', '确定', {duration: 3000});
      },
      (error: HttpErrorResponse) => {
          this.loggerService.log(error);
          const message = errorProcess(error);
          this.snackBar.open(message, '关闭');
      });
  }

}
