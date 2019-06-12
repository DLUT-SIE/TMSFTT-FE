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
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AdminProgramFormComponent } from './admin-program-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Program } from 'src/app/shared/interfaces/program';
import { ProgramForm } from 'src/app/shared/interfaces/program-form';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('AdminProgramFormComponent', () => {
  let component: AdminProgramFormComponent;
  let fixture: ComponentFixture<AdminProgramFormComponent>;
  let getProgramForms$: Subject<PaginatedResponse<ProgramForm>>;
  let getProgramForms: jasmine.Spy;
  let updateProgramForm$: Subject<Program>;
  let getProgramCategories$: Subject<ProgramCategory[]>;
  let getProgramCategories: jasmine.Spy;
  let getProgram$: Subject<Program>;
  let getProgram: jasmine.Spy;
  let createProgramForm$: Subject<Program>;
  let navigate: jasmine.Spy;
  let snackBarOpen: jasmine.Spy;

  const dummyProgramCategory: ProgramCategory = {
    type: 1,
    name: 'sender',
  };

  beforeEach(async(() => {
    updateProgramForm$ = new Subject();
    createProgramForm$ = new Subject();
    getProgramForms$ = new Subject<PaginatedResponse<ProgramForm>>();
    getProgramForms = jasmine.createSpy();
    getProgramForms.and.returnValue(getProgramForms$);
    getProgramCategories$ = new Subject<ProgramCategory[]>();
    getProgramCategories = jasmine.createSpy();
    getProgramCategories.and.returnValue(getProgramCategories$);
    getProgram$ = new Subject<Program>();
    getProgram = jasmine.createSpy();
    getProgram.and.returnValue(getProgram$);
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
          provide: Location,
          useValue: {
            back: () => {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                program_id: '1',
              },
            },
          },
        },
        {
          provide: ProgramService,
          useValue: {
            createProgram: () => createProgramForm$,
            updateProgram: () => updateProgramForm$,
            getProgramCategories: () => getProgramCategories$,
            getProgram,
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
      declarations: [ AdminProgramFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProgramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should load program-categories', () => {

    getProgramCategories$.next([dummyProgramCategory, dummyProgramCategory]);

    expect(component.programCategories).toEqual([dummyProgramCategory, dummyProgramCategory]);
  });

  it('should navigate when creation succeed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createProgramForm$.next({ id: 5 } as Program);

    expect(navigate).toHaveBeenCalledWith(['/admin/programs/', 5]);
  });

  it('should navigate when updation succeed.', () => {
    component.isUpdateMode = true;
    component.program = {
      id: 1,
    };
    component.onSubmit();
    updateProgramForm$.next({ id: 1 } as Program);

    expect(navigate).toHaveBeenCalledWith(['/admin/programs/', 1]);
  });

  it('should load pragram', () => {
    const dummyProgram: Program = {
      id: 1,
      name: 'sender',
      department: 2,
      category: 3,
    };
    getProgram$.next(dummyProgram);

    expect(component.program).toBe(dummyProgram);
  });

  it('should display errors when creation failed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createProgramForm$.error({
      message: 'Raw error message',
      status: 400,
      error: {
        attachments_data: ['Invalid number of attachments'],
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('attachments_data: Invalid number of attachments', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should display raw errors when creation failed.', () => {
    component.isUpdateMode = false;
    component.onSubmit();
    createProgramForm$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(navigate).not.toHaveBeenCalled();
  });
});


