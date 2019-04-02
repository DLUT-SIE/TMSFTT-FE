import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TrainingRecordComponent } from './training-record.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { RecordDetailComponent } from './components/record-detail/record-detail.component';
import { RecordDetailResolverService } from './services/record-detail-resolver.service';
import { RecordEntryComponent } from './components/record-entry/record-entry.component';

const routes: Routes = [
  {
    path: '',
    component: TrainingRecordComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'entry',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'record-form',
            component: RecordFormComponent,
          },
          {
            path: 'batch-submit',
            component: BatchSubmitComponent,
          },
          {
            path: '',
            component: RecordEntryComponent,
          }
        ]
      },
      {
        path: 'records',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: ':id',
            resolve: {
              record: RecordDetailResolverService,
            },
            component: RecordDetailComponent,
          },
          {
            path: '',
            component: RecordListComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRecordRoutingModule { }
