import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBar,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDividerModule,
} from '@angular/material';
import { of as observableOf, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AdminCampusFormComponent } from './admin-campus-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { RoundChoice } from 'src/app/shared/interfaces/round-choice';
import { EventService } from 'src/app/shared/services/events/event.service';
import { CKEditorDirectiveStub } from 'src/testing/ckeditor-stub';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular';
import { RoleChoice } from 'src/app/shared/interfaces/event-role-choices';
import { RecordService } from 'src/app/shared/services/records/record.service';

describe('AdminCampusFormComponent', () => {
  let component: AdminCampusFormComponent;
  let fixture: ComponentFixture<AdminCampusFormComponent>;
  let createEventForm$: Subject<CampusEvent>;
  let updateEventForm$: Subject<CampusEvent>;
  let getRoundChoices$: Subject<RoundChoice[]>;
  let getRoundChoices: jasmine.Spy;
  let getEvent$: Subject<CampusEvent>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let getRoleChoices: jasmine.Spy;
  let getRoleChoices$: Subject<RoleChoice[]>;

  const dummyRoundChoice: RoundChoice = {
    type: 1,
    name: 'sender',
  };

  const dummyEvent: CampusEvent = {
    id: 1,
    create_time: '2019-01-01',
    update_time: '2019-01-02',
    name: '123',
    time: '2019-01-02',
    location: '大连理工大学',
    num_hours: 123,
    num_participants: 21,
    program: 1,
    deadline: '2019-01-02',
    num_enrolled: 12,
    description: '123',
    coefficients: [
      {
        campus_event: 1,
        off_campus_event: null,
        role: 0,
        coefficient: 100.0,
        hours_option: 3,
        workload_option: 1,
        hours_option_str: '四舍五入',
        workload_option_str: '向上取整',
        role_str: '参与'
      },
      {
        campus_event: 1,
        off_campus_event: null,
        role: 0,
        coefficient: 100.0,
        hours_option: 3,
        workload_option: 1,
        hours_option_str: '四舍五入',
        workload_option_str: '向上取整',
        role_str: '参与'
      }
    ]
  };

  beforeEach(async(() => {
    createEventForm$ = new Subject();
    updateEventForm$ = new Subject();
    getEvent$ = new Subject();
    getRoundChoices$ = new Subject<RoundChoice[]>();
    getRoundChoices = jasmine.createSpy();
    getRoundChoices.and.returnValue(getRoundChoices$);
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    getRoleChoices$ = new Subject();
    getRoleChoices = jasmine.createSpy();
    getRoleChoices.and.returnValue(getRoleChoices$);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
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
              queryParams: {
                event_id: '1',
              },
            }
          },
        },
        {
          provide: EventService,
          useValue: {
            createCampusEvent: () => createEventForm$,
            updateCampusEvent: () => updateEventForm$,
            getRoundChoices: () => getRoundChoices$,
            getEvent: () => getEvent$,
          }
        },
        {
          provide: Router,
          useValue: { navigate },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: RecordService,
          useValue: {
            getRoleChoices: () => getRoleChoices$,
          },
        },
      ],
      declarations: [ AdminCampusFormComponent, CKEditorDirectiveStub ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should load round-choices when update', () => {
    component.isUpdateMode = true;
    getRoundChoices$.next([dummyRoundChoice, dummyRoundChoice]);

    expect(component.roundChoices).toEqual([dummyRoundChoice, dummyRoundChoice]);
  });

  it('should load event.', () => {
    getRoundChoices$.next([dummyRoundChoice, dummyRoundChoice]);

    expect(component.roundChoices).toEqual([dummyRoundChoice, dummyRoundChoice]);
    getEvent$.next(dummyEvent);
    expect(component.event).toBe(dummyEvent);
  });

  it('should display errors when failed to get event.', () => {
    getRoundChoices$.next([dummyRoundChoice, dummyRoundChoice]);

    expect(component.roundChoices).toEqual([dummyRoundChoice, dummyRoundChoice]);
    getEvent$.error({
      message: 'Raw error message',
      error: {
        detail: ['can\'t find event'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('can\'t find event。', '关闭');
  });

  it('should navigate when creation succeed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createEventForm$.next({ id: 1 } as CampusEvent);

    expect(navigate).toHaveBeenCalledWith(['admin/programs', 1, 'events', 1]);
  });

  it('should navigate when updation succeed.', () => {
    component.isUpdateMode = true;
    component.event = {
      id: 1,
    };
    component.onSubmit();
    updateEventForm$.next({ id: 1 } as CampusEvent);

    expect(navigate).toHaveBeenCalledWith(['admin/programs', 1, 'events', 1]);
  });

  it('should display errors when creation failed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createEventForm$.error({
      message: 'Raw error message',
      error: {
        attachments_data: ['Invalid number of attachments'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid number of attachments。', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should display raw errors when creation failed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createEventForm$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should update description on editor change.', () => {
    const data = 'abccc';
    const getData = jasmine.createSpy().and.returnValue(data);
    /* tslint:disable-next-line:no-any */
    const editor = {getData} as any;
    const event = {} as CKEditor5.EventInfo<'change:data'>;

    component.descriptionChange({editor, event });

    expect(component.description.value).toEqual(data);
  });
});


describe('AdminCampusFormComponent', () => {
  let component: AdminCampusFormComponent;
  let fixture: ComponentFixture<AdminCampusFormComponent>;
  let createEventForm$: Subject<CampusEvent>;
  let updateEventForm$: Subject<CampusEvent>;
  let getRoundChoices$: Subject<RoundChoice[]>;
  let getRoundChoices: jasmine.Spy;
  let getEvent$: Subject<CampusEvent>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let getRoleChoices: jasmine.Spy;
  let getRoleChoices$: Subject<RoleChoice[]>;

  const dummyRoundChoice: RoundChoice = {
    type: 1,
    name: 'sender',
  };

  const dummyRoleChoice: RoleChoice = {
    role: 0,
    role_str: '123',
  };


  beforeEach(async(() => {
    createEventForm$ = new Subject();
    updateEventForm$ = new Subject();
    getEvent$ = new Subject();
    getRoundChoices$ = new Subject<RoundChoice[]>();
    getRoundChoices = jasmine.createSpy();
    getRoundChoices.and.returnValue(getRoundChoices$);
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    getRoleChoices$ = new Subject();
    getRoleChoices = jasmine.createSpy();
    getRoleChoices.and.returnValue(getRoleChoices$);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
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
              queryParams: {
              },
            }
          },
        },
        {
          provide: EventService,
          useValue: {
            createCampusEvent: () => createEventForm$,
            updateCampusEvent: () => updateEventForm$,
            getRoundChoices: () => getRoundChoices$,
            getEvent: () => getEvent$,
          }
        },
        {
          provide: Router,
          useValue: { navigate },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: RecordService,
          useValue: {
            getRoleChoices: () => getRoleChoices$,
          },
        },
      ],
      declarations: [ AdminCampusFormComponent, CKEditorDirectiveStub ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should load role-choices and round-choices when create', () => {
    component.isUpdateMode = false;
    getRoleChoices$.next([dummyRoleChoice, dummyRoleChoice]);

    expect(component.roleChoices).toEqual([dummyRoleChoice, dummyRoleChoice]);
    getRoundChoices$.next([dummyRoundChoice, dummyRoundChoice]);

    expect(component.roundChoices).toEqual([dummyRoundChoice, dummyRoundChoice]);
  });
});
