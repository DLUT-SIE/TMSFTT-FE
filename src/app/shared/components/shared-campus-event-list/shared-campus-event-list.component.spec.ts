import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import {
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatIconModule,
  MatSnackBar
 } from '@angular/material';
 import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject } from 'rxjs';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Program } from 'src/app/shared/interfaces/program';
import { EventService } from 'src/app/shared/services/events/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { EventListType } from '../../enums/event-list-type.enum';
import { SharedCampusEventListComponent } from './shared-campus-event-list.component';
import { Enrollment } from 'src/app/shared/interfaces/enrollment';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

describe('SharedCampusEventListComponent', () => {
  let component: SharedCampusEventListComponent;
  let fixture: ComponentFixture<SharedCampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEvent>>;
  let getCampusEvents: jasmine.Spy;
  let enrollCampusEvent$: Subject<Enrollment>;

  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  const route = {
    queryParams: observableOf({ program_id: 1 }),
    snapshot: {
      queryParamMap: {
        get: () => '1',
      },
    }
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEvent>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);
    enrollCampusEvent$ = new Subject();
    snackBarOpen = jasmine.createSpy();

    TestBed.configureTestingModule({
      declarations: [
        SharedCampusEventListComponent,
        TruncatePipe
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route,
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
            enrollCampusEvent: () => enrollCampusEvent$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedCampusEventListComponent);
    component = fixture.componentInstance;
    const dummyProgram: Program = {
      id: 1,
      category_str: '青年教师助课',
      department: '飞海科技',
      name: '不过时候之间国际.',
      category: 4
    };
    component.program = dummyProgram;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load event by admin', () => {
    component.eventListType = EventListType.ADMIN;
    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });

  it('should load event by user', () => {
    component.eventListType = EventListType.USER;


    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });

  it('should navigate to program detail', () => {
    component.navigateToProgramDetail();

    expect(navigate).toHaveBeenCalledWith(
      ['../../programs', component.program.id], { relativeTo: route });
  });

  it('should navigate to create form', () => {
    component.navigateToCreateForm();

    expect(navigate).toHaveBeenCalledWith(
      ['./form'], { queryParams: { program_id: component.program.id} , relativeTo: route });
  });

  it('should enroll event.', () => {
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
    const enrollment: Enrollment = {
      id: 1,
      create_time: '123',
      enroll_method: 0,
      campus_event: 1,
      user: 1,
    };

    component.enrollEvent(event);
    enrollCampusEvent$.next(enrollment);

  });

  it('should display errors when enroll failed.', () => {
    enrollCampusEvent$.error({
      message: 'Raw error message',
      error: {
        enrollCampusEvent_data: ['Invalid content'],
      },
    } as HttpErrorResponse);
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
    component.enrollEvent(event);
    expect(snackBarOpen).toHaveBeenCalledWith('报名失败！', '关闭');
  });

  it('should display raw errors when updation failed.', () => {
    enrollCampusEvent$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

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
    component.enrollEvent(event);
    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

});
