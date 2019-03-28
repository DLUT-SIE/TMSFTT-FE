import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatTooltipModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';

import { RegularUserRoutingModule } from './regular-user.routing.module';
import { RegularUserComponent } from './regular-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    RegularUserComponent,
    DashboardComponent,
  ],
  imports: [
    NgxEchartsModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,

    RegularUserRoutingModule
  ],
})
export class RegularUserModule { }
