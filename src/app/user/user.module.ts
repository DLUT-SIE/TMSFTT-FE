import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user.routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventsModule } from './modules/events/events.module';
import { RecordsModule } from './modules/records/records.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
  ],
  imports: [
    EventsModule,
    RecordsModule,
    StatisticsModule,
    UserRoutingModule,
    SharedModule,
  ],
})
export class UserModule { }
