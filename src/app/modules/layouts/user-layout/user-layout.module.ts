import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserLayoutRoutingModule } from './user-layout.routing.module';
import { CommonLayoutModule } from 'src/app/modules/layouts/common-layout/common-layout.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    CommonLayoutModule,
    UserLayoutRoutingModule
  ],
})
export class UserLayoutModule { }
