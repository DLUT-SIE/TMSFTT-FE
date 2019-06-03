import { Component, Input, OnInit } from '@angular/core';

import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { Record } from 'src/app/shared/interfaces/record';

@Component({
  selector: 'app-off-campus-record-detail',
  templateUrl: './off-campus-record-detail.component.html',
  styleUrls: ['./off-campus-record-detail.component.css']
})
export class OffCampusRecordDetailComponent implements OnInit {
  readonly ContentType = ContentType;
  @Input() record: Record;

  constructor() {}

  ngOnInit() {}
}
