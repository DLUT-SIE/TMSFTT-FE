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

@NgModule({
  declarations: [
    DashboardComponent,
    TrainingRecordComponent,
  ],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatTooltipModule,
    CommonModule,
    RouterModule,
  ],
  exports: [
    DashboardComponent,
    TrainingRecordComponent,
  ],
})
export class CommonLayoutModule { }
