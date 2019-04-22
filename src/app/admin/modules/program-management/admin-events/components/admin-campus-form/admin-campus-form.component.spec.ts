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
} from '@angular/material';
import { of as observableOf, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AdminCampusFormComponent } from './admin-campus-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/events/event.service';

describe('AdminCampusFormComponent', () => {
  let component: AdminCampusFormComponent;
  let fixture: ComponentFixture<AdminCampusFormComponent>;
  let createEventForm$: Subject<CampusEvent>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;


  beforeEach(async(() => {
    createEventForm$ = new Subject();
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
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
          provide: EventService,
          useValue: {
            createCampusEvent: () => createEventForm$,
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
      ],
      declarations: [ AdminCampusFormComponent ]
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

  it('should navigate when creation succeed.', () => {
    component.onSubmit();
    createEventForm$.next({ program: 2 } as CampusEvent);

    expect(navigate).toHaveBeenCalledWith(['../event-detail/', 2]);
  });
  it('should display errors when creation failed.', () => {
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
    component.onSubmit();
    createEventForm$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });
});
