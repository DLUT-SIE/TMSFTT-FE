import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSnackBar,
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { RecordFormComponent } from './record-form.component';
import { RecordService } from '../../services/record.service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { RecordResponse } from 'src/app/interfaces/record';
import { HttpErrorResponse } from '@angular/common/http';

describe('RecordFormComponent', () => {
  // Note: We should create Observable before our each test in certain
  // condition, cause if we reuse our observable, some subscriptions
  // subscribed in other unit tests may have not been GCed, and they will
  // respond to new value. This is not a big deal in unit tests, but we
  // need to make sure that we are aware of the consequences of this
  // behavior, such as codes are marked run multiple times in coverage report.
  let createOffCampusRecord$: Subject<RecordResponse>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;
  let component: RecordFormComponent;
  let fixture: ComponentFixture<RecordFormComponent>;

  beforeEach(async(() => {
    createOffCampusRecord$ = new Subject();
    navigate = jasmine.createSpy();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
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
    })
      .compileComponents();
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
});
