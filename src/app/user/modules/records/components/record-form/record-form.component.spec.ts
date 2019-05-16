import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSnackBar,
  MatAutocompleteSelectedEvent,
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { of as observableOf, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { RecordFormComponent } from './record-form.component';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { Record } from 'src/app/shared/interfaces/record';
import { HttpErrorResponse } from '@angular/common/http';
import { OffCampusEvent } from 'src/app/shared/interfaces/event';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { EventService } from 'src/app/shared/services/events/event.service';
import { ContentType } from 'src/app/shared/enums/content-type.enum';
import { RecordAttachmentService } from 'src/app/shared/services/records/record-attachment.service';
import { RecordAttachment } from 'src/app/shared/interfaces/record-attachment';
import { RoleChoice } from 'src/app/shared/interfaces/event-role-choices';

describe('RecordFormComponent', () => {
  // Note: We should create Observable before our each test in certain
  // condition, cause if we reuse our observable, some subscriptions
  // subscribed in other unit tests may have not been GCed, and they will
  // respond to new value. This is not a big deal in unit tests, but we
  // need to make sure that we are aware of the consequences of this
  // behavior, such as codes are marked run multiple times in coverage report.
  let createOffCampusRecord$: Subject<Record>;
  let updateOffCampusRecord$: Subject<Record>;
  let getOffCampusEvents$: Subject<PaginatedResponse<OffCampusEvent>>;
  let getOffCampusEvents: jasmine.Spy;
  let getRecordWithDetail$: Subject<Record>;
  let deleteRecordAttachment$: Subject<RecordAttachment>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let component: RecordFormComponent;
  let fixture: ComponentFixture<RecordFormComponent>;
  let getRoleChoices: jasmine.Spy;
  let getRoleChoices$: Subject<RoleChoice[]>;

  const dummyEvent: OffCampusEvent = {
    id: 5,
    name: 'abc',
    time: 'time',
    location: 'loc',
    num_hours: 5,
    num_participants: 10,
  };

  const dummyRoleChoice: RoleChoice = {
      role: 0,
      role_str: '123',
    };


  beforeEach(async(() => {
    createOffCampusRecord$ = new Subject();
    updateOffCampusRecord$ = new Subject();
    getOffCampusEvents$ = new Subject();
    getRecordWithDetail$ = new Subject();
    deleteRecordAttachment$ = new Subject();
    getRoleChoices$ = new Subject();
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    getOffCampusEvents = jasmine.createSpy();
    getOffCampusEvents.and.returnValue(getOffCampusEvents$);
    getRoleChoices = jasmine.createSpy();
    getRoleChoices.and.returnValue(getRoleChoices$);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
              queryParams: {
                record_id: '1',
              },
            },
            data: observableOf({record: {
              id: 1,
              create_time: '2019-01-01',
              update_time: '2019-01-02',
              campus_event: null,
              off_campus_event: {
                id: 1,
                create_time: '2019-03-02T09:07:57.159755+08:00',
                update_time: '2019-03-02T09:07:57.159921+08:00',
                name: 'sfdg',
                time: '2019-03-02T00:00:00+08:00',
                location: 'dfgfd',
                num_hours: 0,
                num_participants: 25
                },
              contents: [],
              attachments: [],
              user: 1,
              status: 1,
              role: 0,
            } as Record}),
          },
        },
        {
          provide: RecordAttachmentService,
          useValue: {
            deleteRecordAttachment: () => deleteRecordAttachment$,
          },
        },
        {
          provide: RecordService,
          useValue: {
            createOffCampusRecord: () => createOffCampusRecord$,
            updateOffCampusRecord: () => updateOffCampusRecord$,
            getRecordWithDetail: () => getRecordWithDetail$,
            getRoleChoices: () => getRoleChoices$,
          },
        },
        {
          provide: EventService,
          useValue: {
            getOffCampusEvents,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
        {
          provide: Router,
          useValue: { navigate },
        }
      ],
      declarations: [RecordFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load record.', () => {
    const dummyRecord: Record = {
      id: 1,
      create_time: '2019-01-01',
      update_time: '2019-01-02',
      campus_event: null,
      off_campus_event: {
        id: 1,
        create_time: '2019-03-02T09:07:57.159755+08:00',
        update_time: '2019-03-02T09:07:57.159921+08:00',
        name: 'sfdg',
        time: '2019-03-02T00:00:00+08:00',
        location: 'dfgfd',
        num_hours: 0,
        num_participants: 25,
        },
      contents: [
        {
          content_type: ContentType.CONTENT_TYPE_CONTENT,
          content: 'abc',
        },
        {
          content_type: ContentType.CONTENT_TYPE_FEEDBACK,
          content: 'abc',
        },
        {
          content_type: ContentType.CONTENT_TYPE_SUMMARY,
          content: 'abc',
        }
      ],
      attachments: [
        new File([''], 'file'),
        new File([''], 'file'),
      ],
      user: 1,
      status: 1,
      role: 0,
    };
    getRecordWithDetail$.next(dummyRecord);
    expect(component.record).toBe(dummyRecord);
  });

  it('should load role-choices', () => {
    getRoleChoices$.next([dummyRoleChoice, dummyRoleChoice]);

    expect(component.roleChoices).toEqual([dummyRoleChoice, dummyRoleChoice]);
  });

  it('should display errors when failed to get record.', () => {
    getRecordWithDetail$.error({
      message: 'Raw error message',
      error: {
        detail: ['can\'t find record'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('can\'t find record。', '关闭');
  });

  it('should add new FormControl to FormArray.', () => {
    component.addFile();
    component.addFile();

    expect(component.files.length).toBe(2);
  });

  it('should skip when no file added.', () => {
    component.addFile();
    fixture.detectChanges();
    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    fileInput.triggerEventHandler('change', {
      target: {
        files: [],
      }
    });
    expect(component.attachments.length).toBe(0);
  });

  it('should call onFileAdd when button is clicked.', () => {
    component.addFile();
    fixture.detectChanges();
    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    spyOn(component, 'onFileAdd');
    fileInput.triggerEventHandler('change', {});

    expect(component.onFileAdd).toHaveBeenCalled();
  });

  it('should attach file to attachments when file added.', () => {
    component.addFile();
    fixture.detectChanges();
    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    fileInput.triggerEventHandler('change', {
      target: {
        files: [{}],
      }
    });
    expect(component.attachments.length).toBe(1);
  });

  it('should delete file when file is removed.', () => {
    component.addFile();
    component.addFile();
    component.addFile();
    component.attachments.push({ name: 'file0' } as File);
    component.attachments.push({ name: 'file1' } as File);
    component.attachments.push({ name: 'file2' } as File);

    component.onFileRemove(1);

    expect(component.files.length).toBe(2);
    expect(component.attachments.length).toBe(2);
    expect(component.attachments[0].name).toBe('file0');
    expect(component.attachments[1].name).toBe('file2');
  });

  it('should navigate when creation succeed.', () => {
    component.onSubmit();
    createOffCampusRecord$.next({ id: 123 } as Record);

    expect(navigate).toHaveBeenCalledWith(['user/off-campus-event-records/', 123]);
  });

  it('should navigate when updation succeed.', () => {
    component.isUpdateMode = true;
    component.record = {
      id: 1,
      off_campus_event: {id: 1},
      role: 0,
    };
    component.onSubmit();
    updateOffCampusRecord$.next({ id: 123 } as Record);

    expect(navigate).toHaveBeenCalledWith(['user/off-campus-event-records/', 123]);
  });

  it('should display errors when creation failed.', () => {
    component.onSubmit();
    createOffCampusRecord$.error({
      message: 'Raw error message',
      error: {
        attachments_data: ['Invalid number of attachments'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid number of attachments。', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should display raw errors when creation failed.', () => {
    component.onSubmit();
    createOffCampusRecord$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should retrieve auto-complete options when name changed', fakeAsync(() => {
    const name = 'abcde';

    component.name.setValue(name);
    tick(1000);

    getOffCampusEvents$.next({
      count: 2,
      next: '',
      previous: '',
      results: [dummyEvent, dummyEvent],
    });

    const params = new Map<string, {}>([['name__startswith', name]]);
    expect(getOffCampusEvents).toHaveBeenCalledWith({ extraParams: params });
  }));

  it('should set fields with selected option', () => {
    const offCampusEvent: OffCampusEvent = {
      id: 1,
      name: 'abc',
      time: '2019-01-01 12:34:45',
      location: 'loc',
      num_participants: 10,
      num_hours: 3,
    };
    const event = {
      option: {
        value: offCampusEvent,
      },
      source: component.autoComplete,
    };
    component.autoComplete.optionSelected.next(event as MatAutocompleteSelectedEvent);

    expect(component.name.value).toBe(offCampusEvent.name);
    expect(component.time.value).toBe(offCampusEvent.time);
    expect(component.location.value).toBe(offCampusEvent.location);
    expect(component.numHours.value).toBe(offCampusEvent.num_hours);
    expect(component.numParticipants.value).toBe(offCampusEvent.num_participants);
  });

  it('should delete attachment when edit it.', () => {
    component.originalAttachments = [{id: 1, path: {name: 'sdsdj', url: '1433223'}}];
    component.deleteAttachment({id: 1, path: {name: 'sdsdj', url: '1433223'}});
    deleteRecordAttachment$.next({});

    expect(component.originalAttachments.length).toEqual(0);
  });
});
