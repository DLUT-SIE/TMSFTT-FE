import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { DataManagementComponent } from './data-management.component';
import { RecordDetailResolverService } from 'src/app/shared/services/records/record-detail-resolver.service';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { TableExportComponent } from './components/table-export/table-export.component'

const routes: Routes = [
  {
    path: 'data',
    component: DataManagementComponent,
    data: {
      breadcrumb: "数据管理"
    },
    children: [
      {
        path: 'records',
        data: {
          breadcrumb: "培训记录审核"
        },
        children: [
          {
            path: ':id',
            resolve: {
              record: RecordDetailResolverService,
            },
            component: DataReviewComponent,
            data: {
              breadcrumb: "记录详情"
            }
          },
          {
            path: '',
            component: RecordListComponent,
          }
        ]
      },
      {
        path: 'batch-submit',
        component: BatchSubmitComponent,
        data: {
          breadcrumb: "批量导入"
        }
      },
      {
        path: 'table-export',
        component: TableExportComponent,
        data: {
          breadcrumb: '表格导出'
        }
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
