import { AdminCampusEventListComponent } from './admin-campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject  } from 'rxjs';
import { CampusEventResponse } from 'src/app/shared/interfaces/event';
import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from '../../../training-program/services/program.service';
import { EventService } from '../../services/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('AdminCampusEventListComponent', () => {
  let component: AdminCampusEventListComponent;
  let fixture: ComponentFixture<AdminCampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEventResponse>>;
  let getCampusEvents: jasmine.Spy;
  let getProgram$: Subject<Program>;
  let getProgram: jasmine.Spy;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEventResponse>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);
    getProgram$ = new Subject<Program>();
    getProgram = jasmine.createSpy();
    getProgram.and.returnValue(getProgram$);

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
          provide: ProgramService,
          useValue: {
            getProgram
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

  it('should load data', () => {

    const dummyProgram: Program = {
      id: 1,
      name: 'sender',
      department: 2,
      category: 3,
      department_detail: {
        id: 2,
        create_time: '2019-3-4',
        update_time: '2019-3-6',
        name: 'test',
        admins: [],
      },
      category_detail: {
        id: 3,
        name: 'test',
      },
      form: [],
    };
    getProgram.and.returnValue(getProgram$);
    getProgram$.next(dummyProgram);
    expect(component.program).toBe(dummyProgram);
    expect(getProgram).toHaveBeenCalled();
  });

  it('should load event', () => {
    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });
});
