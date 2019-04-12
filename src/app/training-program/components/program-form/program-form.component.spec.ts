import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBar,
} from '@angular/material';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { ProgramFormComponent } from './program-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Program } from 'src/app/shared/interfaces/program';
import { ProgramForm } from 'src/app/shared/interfaces/program-form';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramService } from '../../services/program.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('ProgramFormComponent', () => {
  let component: ProgramFormComponent;
  let fixture: ComponentFixture<ProgramFormComponent>;
  let getProgramForm$: Subject<PaginatedResponse<ProgramForm>>;
  let getProgramForm: jasmine.Spy;
  let getProgramCategory$: Subject<PaginatedResponse<ProgramCategory>>;
  let getProgramCategory: jasmine.Spy;
  let createProgramForm$: Subject<Program>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;

  const dummyProgramForm: ProgramForm = {
    id: 1,
    name: 'sender',
  };

  const dummyProgramCategory: ProgramCategory = {
    id: 1,
    name: 'sender',
  };

  beforeEach(async(() => {
    createProgramForm$ = new Subject();
    getProgramForm$ = new Subject<PaginatedResponse<ProgramForm>>();
    getProgramForm = jasmine.createSpy();
    getProgramForm.and.returnValue(getProgramForm$);
    getProgramCategory$ = new Subject<PaginatedResponse<ProgramCategory>>();
    getProgramCategory = jasmine.createSpy();
    getProgramCategory.and.returnValue(getProgramCategory$);
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
      ],
      providers: [
        {
          provide: ProgramService,
          useValue: {
            createProgram: () => createProgramForm$,
            getProgramForm,
            getProgramCategory,
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
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
      ],
      declarations: [ ProgramFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load program-form', () => {
    const count = 100;
    const results: ProgramForm[] = [dummyProgramForm, dummyProgramForm];
    getProgramForm$.next({ count, results, next: '', previous: '' });

    expect(component.programForms).toEqual(results);
  });

  it('should load program-category', () => {
    const count = 100;
    const results: ProgramCategory[] = [dummyProgramCategory, dummyProgramCategory];
    getProgramCategory$.next({ count, results, next: '', previous: '' });

    expect(component.programCategories).toEqual(results);
  });

  it('should navigate when creation succeed.', () => {
    component.onSubmit();
    createProgramForm$.next({ id: 5 } as Program);

    expect(navigate).toHaveBeenCalledWith(['/admin/event-management/programs/events'], { queryParams: {program_id: 5}});
  });

  it('should display errors when creation failed.', () => {
    component.onSubmit();
    createProgramForm$.error({
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
    createProgramForm$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });
});


