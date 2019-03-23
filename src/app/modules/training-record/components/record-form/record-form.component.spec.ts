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
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { RecordFormComponent } from './record-form.component';
import { RecordService } from '../../services/record.service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { RecordResponse } from 'src/app/interfaces/record';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from 'src/app/modules/training-event/services/event.service';
import { OffCampusEventResponse } from 'src/app/interfaces/event';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';

describe('RecordFormComponent', () => {
  // Note: We should create Observable before our each test in certain
  // condition, cause if we reuse our observable, some subscriptions
  // subscribed in other unit tests may have not been GCed, and they will
  // respond to new value. This is not a big deal in unit tests, but we
  // need to make sure that we are aware of the consequences of this
  // behavior, such as codes are marked run multiple times in coverage report.
  let createOffCampusRecord$: Subject<RecordResponse>;
  let getOffCampusEvents$: Subject<PaginatedResponse<OffCampusEventResponse>>;
  let getOffCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let component: RecordFormComponent;
  let fixture: ComponentFixture<RecordFormComponent>;

  const dummyEvent: OffCampusEventResponse = {
    id: 5,
    name: 'abc',
    time: 'time',
    location: 'loc',
    num_hours: 5,
    num_participants: 10,
  };

  beforeEach(async(() => {
    createOffCampusRecord$ = new Subject();
    getOffCampusEvents$ = new Subject();
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    getOffCampusEvents = jasmine.createSpy();
    getOffCampusEvents.and.returnValue(getOffCampusEvents$);
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
          provide: RecordService,
          useValue: {
            createOffCampusRecord: () => createOffCampusRecord$,
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
    createOffCampusRecord$.next({ id: 123 } as RecordResponse);

    expect(navigate).toHaveBeenCalledWith(['../record-detail/', 123]);
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
    const offCampusEvent: OffCampusEventResponse = {
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
});
