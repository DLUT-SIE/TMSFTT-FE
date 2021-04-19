import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogPerformComponent } from './log-perform.component';
import {
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatNativeDateModule,
  MatInputModule,
  MatChipsModule,
  MatTooltipModule,
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { LogPerformService } from 'src/app/shared/services/data/log-perform.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { LogData } from 'src/app/shared/interfaces/log';
import { Subject } from 'rxjs';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';


describe('LogPerformComponent', () => {
  let component: LogPerformComponent;
  let fixture: ComponentFixture<LogPerformComponent>;
  let getLogs: jasmine.Spy;
  let navigate: jasmine.Spy;
  let getLogs$: Subject<PaginatedResponse<LogData>>;
  let replaceState: jasmine.Spy;
  let go: jasmine.Spy;

  beforeEach(async(() => {
    getLogs$ = new Subject();
    getLogs = jasmine.createSpy().and.returnValue(getLogs$);
    navigate = jasmine.createSpy();
    go = jasmine.createSpy();
    replaceState = jasmine.createSpy();

    TestBed.configureTestingModule({
      declarations: [
        LogPerformComponent,
        TruncatePipe,
      ],
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatIconModule,
        MatDatepickerModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatChipsModule,
        MatTooltipModule,
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
          useValue: {
            navigate,
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: LogPerformService,
          useValue: {
            getLogs,
          }
        },
        {
          provide: Location,
          useValue: {
            go, replaceState,
          },
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
    fixture = TestBed.createComponent(LogPerformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Results', () => {
    const logNum = 100;

    component.filterForm.setValue({logNum,
    });
    const params = new Map<string, number>([
      ['n_line', logNum],
    ]);

    component.getResults();
    expect(getLogs).toHaveBeenCalledWith({extraParams: params});
  });
});
