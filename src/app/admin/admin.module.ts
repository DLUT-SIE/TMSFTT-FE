import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin.routing';
import { AdminComponent } from './admin.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminEventsModule } from './modules/program-management/admin-events/admin-events.module';
import { AdminProgramsModule } from './modules/program-management/admin-programs/admin-programs.module';
import { DataManagementModule } from './modules/data-management/data-management.module';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    SharedModule,
    DataManagementModule,
    AdminProgramsModule,
    AdminEventsModule,
    AdminRoutingModule
  ],
})

export class AdminModule {}
