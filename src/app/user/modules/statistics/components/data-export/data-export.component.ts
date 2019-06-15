import { Component } from '@angular/core';

import { RecordExportType } from 'src/app/shared/enums/record-export-type.enum';

/** TODO(youchen): Fix broken component. */
@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.css']
})
export class DataExportComponent {
  recordExportType: RecordExportType = RecordExportType.EXPORT_FOR_USER;
  constructor() {}
}