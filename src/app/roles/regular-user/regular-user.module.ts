import { NgModule } from '@angular/core';

import { RegularUserRoutingModule } from './regular-user.routing.module';
import { RegularUserComponent } from './regular-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RegularUserComponent,
    DashboardComponent,
  ],
  imports: [
    RegularUserRoutingModule,
    SharedModule,
  ],
})
export class RegularUserModule { }
