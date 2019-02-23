import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatTooltipModule } from '@angular/material';


import { RegularUserRoutingModule } from './regular-user.routing.module';
import { RegularUserComponent } from './regular-user.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    RegularUserComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,

    RegularUserRoutingModule
  ],
})
export class RegularUserModule { }
