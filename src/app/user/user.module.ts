import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user.routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
  ],
})
export class UserModule { }
