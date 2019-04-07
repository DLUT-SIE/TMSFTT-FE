import { NgModule } from '@angular/core';

import { TrainingEventRoutingModule, AdminEventRoutingModule } from './training-event-routing.module';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { TrainingEventComponent } from './training-event.component';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminCampusEventDetailComponent } from './components/admin-campus-event-detail/admin-campus-event-detail.component';
import { AdminCampusEventComponent } from './components/admin-campus-event/admin-campus-event.component';

@NgModule({
  declarations: [
    TrainingEventComponent,
    CampusEventListComponent,
    CampusEventDetailComponent,
  ],
  imports: [
    TrainingEventRoutingModule,
    SharedModule,
  ],
})
export class TrainingEventModule { }

@NgModule({
  declarations: [
    AdminCampusEventComponent,
    AdminCampusEventDetailComponent,
    AdminCampusEventListComponent
  ],
  imports: [
    AdminEventRoutingModule,
    SharedModule,
  ],
})
export class AdminEventModule { }
