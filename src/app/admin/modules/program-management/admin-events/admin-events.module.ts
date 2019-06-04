import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusFormComponent } from './components/admin-campus-form/admin-campus-form.component';
import { AdminEventsComponent } from './admin-events.component';

@NgModule({
  declarations: [
    AdminEventsComponent,
    AdminCampusEventDetailComponent,
    AdminCampusEventListComponent,
    AdminCampusFormComponent,
  ],
  imports: [
    SharedModule,
  ],
})
export class AdminEventsModule { }
