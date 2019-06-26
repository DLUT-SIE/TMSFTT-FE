import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProgramListComponent } from './components/admin-program-list/admin-program-list.component';
import { AdminProgramFormComponent } from './components/admin-program-form/admin-program-form.component';
import { AdminProgramDetailComponent } from './components/admin-program-detail/admin-program-detail.component';
import { AdminCampusEventListComponent } from '../admin-events/components/admin-campus-event-list/admin-campus-event-list.component';

import { AdminCampusEventDetailComponent } from '../admin-events/components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusFormComponent } from '../admin-events/components/admin-campus-form/admin-campus-form.component';
import { AdminEnrollEventComponent } from '../admin-events/components/admin-enroll-event/admin-enroll-event.component';
import { CampusEventDetailResolverService } from 'src/app/shared/services/events/campus-event-detail-resolver.service';
import { AdminEventsComponent } from '../admin-events/admin-events.component';

import { AdminProgramsComponent } from './admin-programs.component';
import { ProgramDetailResolverService } from 'src/app/shared/services/programs/program-detail-resolver.service';
import { AdminCloseRecordsComponent } from '../admin-events/components/admin-close-records/admin-close-records.component';

const routes: Routes = [
  {
    path: 'programs',
    component: AdminProgramsComponent,
    children: [
      {
        path: 'form',
        component: AdminProgramFormComponent,
      },
      {
        path: ':id',
        resolve: {
          program: ProgramDetailResolverService,
        },
        children: [
          {
            path: 'events',
            component: AdminEventsComponent,
            children: [
              {
                path: 'form',
                component: AdminCampusFormComponent,
              },
              {
                path: 'enroll',
                component: AdminEnrollEventComponent,
              },
              {
                path: 'close-record',
                component: AdminCloseRecordsComponent,
              },
              {
                path: ':event_id',
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
          },
          {
            path: '',
            component: AdminProgramDetailComponent,
          },
        ]
      },
      {
        path: '',
        component: AdminProgramListComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminProgramsRoutingModule { }
