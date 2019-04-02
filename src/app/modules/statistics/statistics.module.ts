import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import {
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatButtonModule,
  MatNativeDateModule,
} from '@angular/material';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { MenuComponent } from './components/menu/menu.component';
import { SummaryAnalysisComponent } from './components/summary-analysis/summary-analysis.component';
import { DataExportComponent } from './components/data-export/data-export.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StatisticsComponent, MenuComponent, SummaryAnalysisComponent, DataExportComponent],
  imports: [
    NgxEchartsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    StatisticsRoutingModule
  ]
})
export class StatisticsModule { }
