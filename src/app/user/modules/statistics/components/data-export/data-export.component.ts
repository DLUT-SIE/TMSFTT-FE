import { Component } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { Record } from 'src/app/shared/interfaces/record';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

/** TODO(youchen): Fix broken component. */
@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent extends GenericListComponent<Record> {
  /** Use FormBuilder to build our form to collect Record data. */
  filterForm = this.fb.group({
    eventName: [''],
    location: [''],
    // TODO(youchen): Which time should this field related to.
    startTime: [''],
    endTime: [''],
  });

  readonly datePipe: DatePipe = new DatePipe('zh-Hans');

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly recordService: RecordService,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const value = this.filterForm.value;
    const params = new Map<string, string>([
      ['event_name', value.eventName],
      ['event_location', value.location],
      ['start_time', value.startTime ? this.datePipe.transform(value.startTime, 'yyyy-MM-dd') : value.startTime],
      ['end_time', value.endTime ? this.datePipe.transform(value.endTime, 'yyyy-MM-dd') : value.endTime],
    ]);
    return this.recordService.getRecords('records', {offset, limit, extraParams: params});
  }

}
