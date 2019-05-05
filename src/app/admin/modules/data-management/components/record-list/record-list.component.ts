import { Component} from '@angular/core';

import { RecordListType } from 'src/app/shared/enums/record-list-type.enum';

/** Display a list of Records. */
@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})

export class RecordListComponent {
  recordListType: RecordListType = RecordListType.ALL_RECORDS;
  constructor() { }
}
