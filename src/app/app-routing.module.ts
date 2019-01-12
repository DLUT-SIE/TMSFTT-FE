import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TrainingRecordEntryModeComponent } from './training-record-entry-mode/training-record-entry-mode.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'training-record-entry',
    redirectTo: '/training-record-entry/entry-mode',
    pathMatch: 'full'
  },
  {
    path: 'training-record-entry/entry-mode',
    component: TrainingRecordEntryModeComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
