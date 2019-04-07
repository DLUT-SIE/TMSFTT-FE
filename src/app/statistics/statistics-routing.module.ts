import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { StatisticsComponent } from './statistics.component';
import { MenuComponent } from './components/menu/menu.component';
import { SummaryAnalysisComponent } from './components/summary-analysis/summary-analysis.component';
import { DataExportComponent } from './components/data-export/data-export.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'summary-analysis',
        component: SummaryAnalysisComponent,
      },
      {
        path: 'data-export',
        component: DataExportComponent,
      },
      {
        path: '',
        component: MenuComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
