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
  MatTooltipModule,
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
import { DetailSectionComponent } from './components/detail-section/detail-section.component';
import { DetailItemComponent } from './components/detail-item/detail-item.component';
import { DetailItemTitleComponent } from './components/detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from './components/detail-item-content/detail-item-content.component';
import { DetailSectionActionsComponent } from './components/detail-section-actions/detail-section-actions.component';
import { AsSecuredPathPipe } from './pipes/as-secured-path.pipe';


@NgModule({
  declarations: [
    OffCampusRecordDetailComponent,
    SharedRecordListComponent,
    TruncatePipe,
    SharedCampusEventDetailComponent,
    SharedCampusEventListComponent,
    DetailSectionComponent,
    DetailItemComponent,
    DetailItemTitleComponent,
    DetailItemContentComponent,
    DetailSectionActionsComponent,
    AsSecuredPathPipe,
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
    MatDividerModule,
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
    MatTooltipModule,

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
    MatTooltipModule,

    OffCampusRecordDetailComponent,
    SharedRecordListComponent,
    SharedCampusEventDetailComponent,
    SharedCampusEventListComponent,
    DetailSectionComponent,
    DetailItemComponent,
    DetailItemTitleComponent,
    DetailItemContentComponent,
    DetailSectionActionsComponent,

    NgxEchartsModule,
    CKEditorModule,

    TruncatePipe,
    AsSecuredPathPipe,
  ],
})
export class SharedModule { }
