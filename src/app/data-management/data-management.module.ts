import { NgModule } from '@angular/core';

import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { RecordListComponent } from './components/record-list/record-list.component';
import { DataReviewComponent } from './components/data-review/data-review.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DataManagementComponent, MenuComponent, RecordListComponent, DataReviewComponent],
  imports: [
    SharedModule,
    DataManagementRoutingModule,
  ]
})
export class DataManagementModule { }