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
import { SchoolAdminGuard } from 'src/app/shared/guards/school-admin.guard';
import { AdminCampusEventReviewListComponent } from './components/admin-campus-event-review-list/admin-campus-event-review-list.component';
import { CampusEventDetailResolverService } from 'src/app/shared/services/events/campus-event-detail-resolver.service';
import { AdminCampusEventDetailComponent } from '../program-management/admin-events/components/admin-campus-event-detail/admin-campus-event-detail.component';
import { RecordExportComponent } from './components/record-export/record-export.component';

const routes: Routes = [
  {
    path: 'data',
    component: DataManagementComponent,
    children: [
      {
        path: 'review',
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
            path: 'events',
            canActivate: [SchoolAdminGuard],
            children: [
              {
                path: ':event_id',
                resolve: {
                  event: CampusEventDetailResolverService,
                },
                component: AdminCampusEventDetailComponent,
              },
              {
                path: '',
                component: AdminCampusEventReviewListComponent,
              }
            ]
          },
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
        path: 'record-export',
        component: RecordExportComponent,
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
