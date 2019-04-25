import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordListComponent } from './record-list.component';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Location } from '@angular/common';

describe('RecordListComponent', () => {
  let component: RecordListComponent;
  let navigate: jasmine.Spy;
  let fixture: ComponentFixture<RecordListComponent>;
  let getRecordsWithDetail$: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getRecordsWithDetail$ = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        RecordListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
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
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate,
            createUrlTree: () => 'abc',
          }
        },
        {
          provide: RecordService,
          useValue: {
            getRecordsWithDetail: () => getRecordsWithDetail$,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
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

  it('should load data', () => {
    expect(component.getResults(0, 0)).toBe(getRecordsWithDetail$);
  });
});
