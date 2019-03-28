import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { MenuComponent } from './components/menu/menu.component';
import { SummaryAnalysisComponent } from './components/summary-analysis/summary-analysis.component';
import { DataExportComponent } from './components/data-export/data-export.component';

@NgModule({
  declarations: [StatisticsComponent, MenuComponent, SummaryAnalysisComponent, DataExportComponent],
  imports: [
    CommonModule,
    RouterModule,
    StatisticsRoutingModule
  ]
})
export class StatisticsModule { }
