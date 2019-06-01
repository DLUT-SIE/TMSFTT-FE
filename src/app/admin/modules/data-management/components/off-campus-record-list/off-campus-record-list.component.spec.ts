import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { OffCampusRecordListComponent } from './off-campus-record-list.component';
import { AppSharedRecordListDirectiveStub } from 'src/testing/app-shared-record-list-stub';
describe('OffCampusRecordListComponent', () => {
  let component: OffCampusRecordListComponent;
  let fixture: ComponentFixture<OffCampusRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OffCampusRecordListComponent,
        AppSharedRecordListDirectiveStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: Location,
          useValue: {},
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
