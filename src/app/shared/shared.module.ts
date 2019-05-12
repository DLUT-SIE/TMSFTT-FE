import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCardModule,
  MatProgressBarModule,
  MatIconModule,
  MatBadgeModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatSnackBarModule,
  MatNativeDateModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDividerModule,
  MatListModule,
  MatChipsModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { OffCampusRecordDetailComponent } from './components/off-campus-record-detail/off-campus-record-detail.component';
import { SharedRecordListComponent } from './components/shared-record-list/shared-record-list.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SharedCampusEventDetailComponent } from './components/shared-campus-event-detail/shared-campus-event-detail.component';
import { SharedCampusEventListComponent } from './components/shared-campus-event-list/shared-campus-event-list.component';


@NgModule({
  declarations: [
    OffCampusRecordDetailComponent,
    SharedRecordListComponent,
    TruncatePipe,
    SharedCampusEventDetailComponent,
    SharedCampusEventListComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,

    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,

    NgxEchartsModule,
    CKEditorModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,

    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,

    OffCampusRecordDetailComponent,
    SharedRecordListComponent,
    SharedCampusEventDetailComponent,
    SharedCampusEventListComponent,

    NgxEchartsModule,
    CKEditorModule,

    TruncatePipe,
  ],
})
export class SharedModule { }
