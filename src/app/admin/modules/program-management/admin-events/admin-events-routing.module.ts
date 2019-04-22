import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusFormComponent } from './components/admin-campus-form/admin-campus-form.component';
import { EventDetailResolverService } from 'src/app/shared/services/events/event-detail-resolver.service';
import { AdminEventsComponent } from './admin-events.component';

const routes: Routes = [
  {
    path: 'events',
    component: AdminEventsComponent,
    children: [
      {
        path: 'form',
        component: AdminCampusFormComponent,
      },
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
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminEventsRoutingModule { }

