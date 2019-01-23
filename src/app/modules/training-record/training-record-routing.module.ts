import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryModeComponent } from './components/entry-mode/entry-mode.component';
import { RecordFormComponent } from './components/record-form/record-form.component';
import { BatchSubmitComponent } from './components/batch-submit/batch-submit.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
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
