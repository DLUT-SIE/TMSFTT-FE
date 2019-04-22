import { CampusEventListComponent } from './campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/events/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('CampusEventListComponent', () => {
  let component: CampusEventListComponent;
  let fixture: ComponentFixture<CampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEvent>>;
  let getCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEvent>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);
    TestBed.configureTestingModule({
      declarations: [
        CampusEventListComponent,
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
    fixture = TestBed.createComponent(CampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });

});
