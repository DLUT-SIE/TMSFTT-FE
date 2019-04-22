import { NgModule } from '@angular/core';

import { EventsRoutingModule } from './events-routing.module';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { EventsComponent } from './events.component';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EventsComponent,
    CampusEventListComponent,
    CampusEventDetailComponent,
  ],
  imports: [
    EventsRoutingModule,
    SharedModule,
  ],
})
export class EventsModule { }
