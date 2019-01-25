import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatTooltipModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from 'src/app/demo/dashboard/dashboard.component';
import { TrainingRecordComponent } from 'src/app/modules/training-record/training-record.component';
import { RegularUserRoutingModule } from './regular-user.routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    TrainingRecordComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    RouterModule,

    RegularUserRoutingModule
  ],
})
export class RegularUserModule { }
