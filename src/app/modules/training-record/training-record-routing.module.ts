import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryModeComponent } from './components/entry-mode/entry-mode.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { TrainingRecordComponent } from './training-record.component';
import { RecordListComponent } from './components/record-list/record-list.component';

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
            component: EntryModeComponent,
          }
        ]
      },
      {
        path: 'records',
        canActivateChild: [AuthGuard],
        children: [
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
