import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import { RecordReviewRoutingModule } from './record-review-routing.module';
import { RecordReviewComponent } from './record-review.component';
import { MenuComponent } from './components/menu/menu.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { DataReviewComponent } from './components/data-review/data-review.component';

@NgModule({
  declarations: [RecordReviewComponent, MenuComponent, RecordListComponent, DataReviewComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RecordReviewRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
})
export class RecordReviewModule { }
