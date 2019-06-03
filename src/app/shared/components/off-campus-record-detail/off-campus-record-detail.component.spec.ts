import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {
  MatPaginatorModule,
  MatIconModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import { OffCampusRecordDetailComponent } from './off-campus-record-detail.component';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { AsSecuredPathPipe } from 'src/app/shared/pipes/as-secured-path.pipe';
import { AppRecordStatusChangeLogsSectionStub } from 'src/testing/app-record-status-change-logs-section-stub';
import { AppOffCampusRecordReviewNotesSectionStub } from 'src/testing/app-off-campus-record-review-notes-section-stub';

describe('OffCampusRecordDetailComponent', () => {
  let component: OffCampusRecordDetailComponent;
  let fixture: ComponentFixture<OffCampusRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppOffCampusRecordReviewNotesSectionStub,
        AppRecordStatusChangeLogsSectionStub,
        OffCampusRecordDetailComponent,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
        AsSecuredPathPipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatDividerModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusRecordDetailComponent);
    component = fixture.componentInstance;
    const record = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: null,
      off_campus_event: {
        id: 1,
        create_time: '2019-03-02T09:07:57.159755+08:00',
        update_time: '2019-03-02T09:07:57.159921+08:00',
        name: 'sfdg',
        time: '2019-03-02T00:00:00+08:00',
        location: 'dfgfd',
        num_hours: 0,
        num_participants: 25
        },
      contents: [],
      attachments: [],
      user: 1,
      status: 1,
      role: 1,
      role_str: '1433223',
    };
    component.record = record;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
