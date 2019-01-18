import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingRecordComponent } from './training-record/training-record.component';
import { EntryModeComponent } from './entry-mode/entry-mode.component';
import { RecordFormComponent } from './record-form/record-form.component';
import { BatchSubmitComponent } from './batch-submit/batch-submit.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'training-record',
    component: TrainingRecordComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'entry',
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
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRecordRoutingModule { }
