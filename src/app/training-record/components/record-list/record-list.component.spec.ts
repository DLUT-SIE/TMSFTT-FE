import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { RecordListComponent } from './record-list.component';
import { RecordService } from '../../services/record.service';
import { RecordResponse } from 'src/app/shared/interfaces/record';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('RecordListComponent', () => {
  let component: RecordListComponent;
  let navigate: jasmine.Spy;
  let fixture: ComponentFixture<RecordListComponent>;
  let getReviewedRecords$: Subject<PaginatedResponse<RecordResponse>>;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getReviewedRecords$ = new Subject<PaginatedResponse<RecordResponse>>();
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
          },
        },
        {
          provide: RecordService,
          useValue: {
            getReviewedRecords: () => getReviewedRecords$,
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
});
