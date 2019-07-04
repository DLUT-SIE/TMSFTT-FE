import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampusEventRetrievalComponent } from './admin-campus-event-retrieval.component';
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
import { EventService } from 'src/app/shared/services/events/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Subject } from 'rxjs';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

describe('AdminCampusEventRetrievalComponent', () => {
  let component: AdminCampusEventRetrievalComponent;
  let fixture: ComponentFixture<AdminCampusEventRetrievalComponent>;
  let getCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEvent>>;
  let replaceState: jasmine.Spy;
  let go: jasmine.Spy;

  beforeEach(async(() => {
    getCampusEvents$ = new Subject();
    getCampusEvents = jasmine.createSpy().and.returnValue(getCampusEvents$);
    navigate = jasmine.createSpy();
    go = jasmine.createSpy();
    replaceState = jasmine.createSpy();

    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventRetrievalComponent,
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
          provide: EventService,
          useValue: {
            getCampusEvents,
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
    fixture = TestBed.createComponent(AdminCampusEventRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Results', () => {
    const eventName = 'abc';
    const offset = 5;
    const limit = 10;

    component.filterForm.setValue({eventName,
    });
    const params = new Map<string, string>([
      ['name__icontains', eventName],
    ]);

    component.getResults(offset, limit);
    expect(getCampusEvents).toHaveBeenCalledWith({offset, limit, extraParams: params});
  });

  it('should navigate to  event detail', () => {
    const event: CampusEvent = {
      id: 1,
      name: 'test',
      time: 'time',
      location: 'location',
      num_hours: 12,
      num_participants: 1,
      deadline: 'deadline',
      description: '666',
      program: 1,
    };
    component.navigateToDetail(event);
    expect(navigate).toHaveBeenCalledWith(['admin', 'programs', 1, 'events', 1]);
  });
});
