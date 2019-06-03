import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { OffCampusRecordListComponent } from './components/off-campus-record-list/off-campus-record-list.component';
import { DataManagementComponent } from './data-management.component';
import { RecordDetailResolverService } from 'src/app/shared/services/records/record-detail-resolver.service';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { DataGraphComponent } from './components/data-graph/data-graph.component';
import { TableExportComponent } from './components/table-export/table-export.component';

const routes: Routes = [
  {
    path: 'data',
    component: DataManagementComponent,
    children: [
      {
        path: 'records',
        children: [
          {
            path: ':id',
            resolve: {
              record: RecordDetailResolverService,
            },
            component: DataReviewComponent,
          },
          {
            path: '',
            component: OffCampusRecordListComponent,
          }
        ]
      },
      {
        path: 'batch-submit',
        component: BatchSubmitComponent,
      },
      {
        path: 'data-graph',
        component: DataGraphComponent,
      },
      {
        path: 'table-export',
        component: TableExportComponent,
      },
      {
        path: '',
        component: MenuComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
