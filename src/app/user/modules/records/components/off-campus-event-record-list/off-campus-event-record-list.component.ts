import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordListType } from 'src/app/shared/enums/record-list-type.enum';

@Component({
  selector: 'app-off-campus-event-record-list',
  templateUrl: './off-campus-event-record-list.component.html',
  styleUrls: ['./off-campus-event-record-list.component.css']
})
export class OffCampusEventRecordListComponent {

  recordListType: RecordListType = RecordListType.OffCampusEventRecords;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
  ) { }

  navigateToForm() {
    this.router.navigate(['.', 'form'], { relativeTo: this.route });
  }

}
