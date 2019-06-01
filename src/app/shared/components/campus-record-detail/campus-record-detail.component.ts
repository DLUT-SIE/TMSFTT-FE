import { Component, OnInit, Input } from '@angular/core';
import { Record } from 'src/app/shared/interfaces/record';

@Component({
  selector: 'app-campus-record-detail',
  templateUrl: './campus-record-detail.component.html',
  styleUrls: ['./campus-record-detail.component.css']
})
export class CampusRecordDetailComponent implements OnInit {
  @Input() record: Record;

  constructor() { }

  ngOnInit() {
  }

}
