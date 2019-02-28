import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableListComponent } from './components/table-list/table-list.component';
import { DetailComponent } from './components/detail/detail.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TrainingEventComponent } from './training-event.component';
import { EventDetailResolverService } from './services/event-detail-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: TrainingEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'table-list',
        // canActivateChild: [AuthGuard],
        children: [
          {
            path: ':id',
            resolve: {
              item: EventDetailResolverService,
            },
            component: DetailComponent,
          },


          {
            path: '',
            component: TableListComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingEventRoutingModule { }
