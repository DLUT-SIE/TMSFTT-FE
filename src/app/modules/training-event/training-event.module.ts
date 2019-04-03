import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { TrainingEventRoutingModule } from './training-event-routing.module';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { TrainingEventComponent } from './training-event.component';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';
import { AdminCampusEventListComponent } from './components/admin-campus-event-list/admin-campus-event-list.component';

@NgModule({
  declarations: [
    TrainingEventComponent,
    CampusEventListComponent,
    CampusEventDetailComponent,
    AdminCampusEventListComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,

    TrainingEventRoutingModule
  ],
})
export class TrainingEventModule { }
