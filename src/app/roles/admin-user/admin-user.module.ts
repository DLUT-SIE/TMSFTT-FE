import { NgModule } from '@angular/core';

import { AdminUserRoutingModule } from './admin-user.routing';
import { AdminUserComponent } from './admin-user.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AdminUserComponent,
  ],
  imports: [
    SharedModule,
    AdminUserRoutingModule
  ],
})

export class AdminUserModule {}
