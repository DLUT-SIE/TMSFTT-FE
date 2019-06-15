import { Component } from '@angular/core';

import { RecordExportType } from 'src/app/shared/enums/record-export-type.enum';

@Component({
  selector: 'app-record-export',
  templateUrl: './record-export.component.html',
  styleUrls: ['./record-export.component.css']
})
export class RecordExportComponent {

  recordExportType: RecordExportType = RecordExportType.EXPORT_FOR_ADMIN;

  constructor() { }

}
