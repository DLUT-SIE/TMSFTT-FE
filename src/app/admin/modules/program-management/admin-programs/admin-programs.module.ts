import { NgModule } from '@angular/core';

import { AdminProgramsRoutingModule } from './admin-programs-routing.module';
import { AdminProgramListComponent } from './components/admin-program-list/admin-program-list.component';
import { AdminProgramDetailComponent } from './components/admin-program-detail/admin-program-detail.component';
import { AdminProgramsComponent } from './admin-programs.component';
import { AdminProgramFormComponent } from './components/admin-program-form/admin-program-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AdminProgramListComponent,
    AdminProgramDetailComponent,
    AdminProgramsComponent,
    AdminProgramFormComponent,
  ],
  imports: [
    AdminProgramsRoutingModule,
    SharedModule,
  ],
})
export class AdminProgramsModule { }
