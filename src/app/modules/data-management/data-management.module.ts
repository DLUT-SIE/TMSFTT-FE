import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
} from '@angular/material';

import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { DataReviewComponent } from './components/data-review/data-review.component';

@NgModule({
  declarations: [DataManagementComponent, MenuComponent, RecordListComponent, DataReviewComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    DataManagementRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DataManagementModule { }
