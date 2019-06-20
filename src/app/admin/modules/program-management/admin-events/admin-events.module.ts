import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusFormComponent } from './components/admin-campus-form/admin-campus-form.component';
import { AdminEventsComponent } from './admin-events.component';
import { AdminEnrollEventComponent } from './components/admin-enroll-event/admin-enroll-event.component';

@NgModule({
  declarations: [
    AdminEventsComponent,
    AdminCampusEventDetailComponent,
    AdminCampusEventListComponent,
    AdminCampusFormComponent,
    AdminEnrollEventComponent,
  ],
  imports: [
    SharedModule,
  ],
})
export class AdminEventsModule { }
