import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { TrainingEventComponent } from './training-event.component';
import { EventDetailResolverService } from './services/event-detail-resolver.service';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusEventComponent } from './components/admin-campus-event/admin-campus-event.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingEventComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'events',
        children: [
          {
            path: ':id',
            resolve: {
              item: EventDetailResolverService,
            },
            component: CampusEventDetailComponent,
          },
          {
            path: '',
            component: CampusEventListComponent
          },
        ]
      }
    ]
  }
];

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminCampusEventComponent,
    children: [
      {
        path: ':id',
        resolve: {
          item: EventDetailResolverService,
        },
        component: AdminCampusEventDetailComponent,
      },
      {
        path: '',
        component: AdminCampusEventListComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TrainingEventRoutingModule { }

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [RouterModule]
})
export class AdminEventRoutingModule { }

