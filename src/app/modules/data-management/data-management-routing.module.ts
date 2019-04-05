import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DataManagementComponent } from './data-management.component';
import { RecordDetailResolverService } from './services/record-detail-resolver.service';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DataManagementComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AdminGuard],
        children: [
          {
            path: 'records',
            canActivate: [AdminGuard],
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
                component: RecordListComponent,
              }
            ]
          },
          {
            path: '',
            component: MenuComponent,
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }
