import { Component} from '@angular/core';

import { RecordListType } from 'src/app/shared/enums/record-list-type.enum';

/** Display a list of Records. */
@Component({
  selector: 'app-off-campus-record-list',
  templateUrl: './off-campus-record-list.component.html',
  styleUrls: ['./off-campus-record-list.component.css']
})

export class OffCampusRecordListComponent {
  recordListType: RecordListType = RecordListType.RECORDS_FOR_REVIEW;
  constructor() { }
}
