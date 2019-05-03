import { NgModule } from '@angular/core';

import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { DataGraphComponent } from './components/data-graph/data-graph.component';
import { DataGraphCanvasComponent } from './components/data-graph-canvas/data-graph-canvas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableExportComponent } from './components/table-export/table-export.component';
import { DataGraphComponent } from './components/data-graph/data-graph.component';
import { DataGraphCanvasComponent } from './components/data-graph-canvas/data-graph-canvas.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DataManagementComponent,
    MenuComponent,
    RecordListComponent,
    DataReviewComponent,
    BatchSubmitComponent,
    DataGraphComponent,
    DataGraphCanvasComponent,
    TableExportComponent,
    DataGraphComponent,
    DataGraphCanvasComponent,
    TableExportComponent,
  ],
  imports: [
    SharedModule,
    DataManagementRoutingModule,
    ReactiveFormsModule
  ]
})
export class DataManagementModule { }
