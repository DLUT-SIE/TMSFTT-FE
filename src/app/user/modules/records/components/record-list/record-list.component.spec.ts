import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordListComponent } from './record-list.component';
import { SharedRecordListComponent } from 'src/app/shared/components/shared-record-list/shared-record-list.component';

describe('RecordListComponent', () => {
  let component: RecordListComponent;
  let fixture: ComponentFixture<RecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecordListComponent,
        SharedRecordListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(RecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
