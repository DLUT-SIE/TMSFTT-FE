import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RecordService } from 'src/app/training-record/services/record.service';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent extends GenericListComponent<RecordResponse> {
  /** Use FormBuilder to build our form to collect Record data. */
  filterForm = this.fb.group({
    eventName: [''],
    location: [''],
    // TODO(youchen): Which time should this field related to.
    startTime: [''],
    endTime: [''],
  });

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
      ['event__name', value.eventName],
      ['event__location', value.location],
      ['startTime', value.startTime],
      ['endTime', value.endTime],
    ]);
    return this.recordService.getRecords({offset, limit, extraParams: params});
  }

}
