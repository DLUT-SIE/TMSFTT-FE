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

import { ProgramFormComponent } from './program-form.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Program } from 'src/app/shared/interfaces/program';
import { ProgramForm } from 'src/app/shared/interfaces/program-form';
import { ProgramCategory } from 'src/app/shared/interfaces/program-category';
import { ProgramService } from '../../services/program.service';
import { ProgramFormService} from '../../services/program-form.service';
import { ProgramCategoryService} from '../../services/program-category.service';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('ProgramFormComponent', () => {
  let component: ProgramFormComponent;
  let fixture: ComponentFixture<ProgramFormComponent>;
  let getProgramForms$: Subject<PaginatedResponse<ProgramForm>>;
  let getProgramForms: jasmine.Spy;
  let getProgramCategories$: Subject<PaginatedResponse<ProgramCategory>>;
  let getProgramCategories: jasmine.Spy;
  let getProgram$: Subject<Program>;
  let getProgram: jasmine.Spy;
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
    getProgramForms$ = new Subject<PaginatedResponse<ProgramForm>>();
    getProgramForms = jasmine.createSpy();
    getProgramForms.and.returnValue(getProgramForms$);
    getProgramCategories$ = new Subject<PaginatedResponse<ProgramCategory>>();
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
            getProgram,
          }
        },
        {
          provide: ProgramFormService,
          useValue: {
            getProgramForms,
          }
        },
        {
          provide: ProgramCategoryService,
          useValue: {
            getProgramCategories,
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

  it('should load program-forms', () => {
    const count = 100;
    const results: ProgramForm[] = [dummyProgramForm, dummyProgramForm];
    getProgramForms$.next({ count, results, next: '', previous: '' });

    expect(component.programForms).toEqual(results);
  });

  it('should load program-categories', () => {
    const count = 100;
    const results: ProgramCategory[] = [dummyProgramCategory, dummyProgramCategory];
    getProgramCategories$.next({ count, results, next: '', previous: '' });

    expect(component.programCategories).toEqual(results);
  });

  it('should navigate when creation succeed.', () => {
    component.onSubmit();
    createProgramForm$.next({ id: 5 } as Program);

    expect(navigate).toHaveBeenCalledWith(['/admin/event-management/programs/events'], { queryParams: {program_id: 5}});
  });

  it('should load pragram', () => {
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
    getProgram$.next(dummyProgram);

    expect(component.program).toBe(dummyProgram);
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


