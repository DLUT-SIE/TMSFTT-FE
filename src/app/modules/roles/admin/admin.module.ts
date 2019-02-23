import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin.routing';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AdminComponent,
  ],
  imports: [
    AdminRoutingModule
  ],
})

export class AdminModule {}
