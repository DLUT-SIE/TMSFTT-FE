import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { RecordExportComponent } from './record-export.component';
import { AppSharedRecordExportDirectiveStub } from 'src/testing/app-shared-record-export-stub';

describe('RecordExportComponent', () => {
  let component: RecordExportComponent;
  let fixture: ComponentFixture<RecordExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecordExportComponent,
        AppSharedRecordExportDirectiveStub,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            }
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
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
