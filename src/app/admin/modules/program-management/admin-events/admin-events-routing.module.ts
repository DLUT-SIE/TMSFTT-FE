import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusFormComponent } from './components/admin-campus-form/admin-campus-form.component';
import { CampusEventDetailResolverService } from 'src/app/shared/services/events/campus-event-detail-resolver.service';
import { AdminEventsComponent } from './admin-events.component';
import { AdminCampusEventReviewListComponent } from './components/admin-campus-event-review-list/admin-campus-event-review-list.component';
import { SchoolAdminGuard } from 'src/app/shared/guards/school-admin.guard';

const routes: Routes = [
  {
    path: 'events',
    component: AdminEventsComponent,
    children: [
      {
        path: 'review',
        canActivate: [SchoolAdminGuard],
        children: [
          {
            path: '',
            component: AdminCampusEventReviewListComponent,
          }
        ]
      },
      {
        path: 'form',
        component: AdminCampusFormComponent,
      },
      {
        path: ':id',
        resolve: {
          event: CampusEventDetailResolverService,
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
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminEventsRoutingModule { }

