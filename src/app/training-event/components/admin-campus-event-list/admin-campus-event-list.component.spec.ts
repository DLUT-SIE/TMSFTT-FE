import { AdminCampusEventListComponent } from './admin-campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject  } from 'rxjs';
import { CampusEventResponse } from 'src/app/shared/interfaces/event';
import { EventService } from '../../services/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('AdminCampusEventListComponent', () => {
  let component: AdminCampusEventListComponent;
  let fixture: ComponentFixture<AdminCampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEventResponse>>;
  let getCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEventResponse>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);
    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventListComponent,
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
            queryParams: observableOf({program_id: 1}),
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            }
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
          }
        },
        {
          provide: EventService,
          useValue: {
            getCampusEvents: () => getCampusEvents$,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
