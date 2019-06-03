import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusRecordDetailComponent } from './campus-record-detail.component';
import { DetailItemComponent } from '../detail-item/detail-item.component';
import { DetailItemContentComponent } from '../detail-item-content/detail-item-content.component';
import { DetailItemTitleComponent } from '../detail-item-title/detail-item-title.component';
import { AppRecordStatusChangeLogsSectionStub } from 'src/testing/app-record-status-change-logs-section-stub';
import { DetailSectionComponent } from '../detail-section/detail-section.component';
import { MatDividerModule } from '@angular/material';
import { Record } from '../../interfaces/record';

describe('CampusRecordDetailComponent', () => {
  let component: CampusRecordDetailComponent;
  let fixture: ComponentFixture<CampusRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppRecordStatusChangeLogsSectionStub,
        CampusRecordDetailComponent,
        DetailSectionComponent,
        DetailItemTitleComponent,
        DetailItemComponent,
        DetailItemContentComponent,
      ],
      imports: [
        MatDividerModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusRecordDetailComponent);
    component = fixture.componentInstance;
    const record: Record = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: {
        id: 1,
        create_time: '2019-03-02T09:07:57.159755+08:00',
        update_time: '2019-03-02T09:07:57.159921+08:00',
        name: 'sfdg',
        time: '2019-03-02T00:00:00+08:00',
        location: 'dfgfd',
        num_hours: 0,
        num_participants: 25,
        program_detail: {
          department: 'ABC',
          category_str: 'a',
        },
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
