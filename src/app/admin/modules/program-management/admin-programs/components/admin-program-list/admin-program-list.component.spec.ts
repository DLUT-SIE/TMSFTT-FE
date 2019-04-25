import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Program } from 'src/app/shared/interfaces/program';
import { Department } from 'src/app/shared/interfaces/department';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { ProgramDepartmentService } from 'src/app/shared/services/programs/program-department.service';
import { AdminProgramListComponent } from './admin-program-list.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('AdminProgramListComponent', () => {
  let component: AdminProgramListComponent;
  let fixture: ComponentFixture<AdminProgramListComponent>;
  let getPrograms$: Subject<PaginatedResponse<Program>>;
  let getProgramDepartments$: Subject<PaginatedResponse<Department>>;
  let navigate: jasmine.Spy;
  let getPrograms: jasmine.Spy;
  let getProgramDepartments: jasmine.Spy;

  const dummyProgram: Program = {
    id: 1,
    name: 'sender',
    department: {
      id: 2,
      create_time: '2019-3-4',
      update_time: '2019-3-6',
      name: 'test',
      admins: [],
    },
    category: 3,
    form: [],
  };
  const dummyProgramDepartment: Department = {
    id: 1,
    name: 'me',
    users: [1, 2],
    admins: [2],
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getPrograms$ = new Subject<PaginatedResponse<Program>>();
    getPrograms = jasmine.createSpy();
    getProgramDepartments$ = new Subject<PaginatedResponse<Department>>();
    getProgramDepartments = jasmine.createSpy();
    getPrograms.and.returnValue(getPrograms$);
    getProgramDepartments.and.returnValue(getProgramDepartments$);
    TestBed.configureTestingModule({
      declarations: [
        AdminProgramListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: ProgramService,
          useValue: {
            getPrograms,
          }
        },
        {
          provide: ProgramDepartmentService,
          useValue: {
            getProgramDepartments,
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
    fixture = TestBed.createComponent(AdminProgramListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    let results = [dummyProgramDepartment, dummyProgramDepartment];
    getProgramDepartments$.next({ count, results, next: '', previous: '' });
    results = [dummyProgram, dummyProgram];
    getPrograms$.next({ count, results, next: '', previous: '' });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.programs).toEqual(results);
  });

  it('should empty data if an error encountered.', () => {
    getPrograms$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.programs).toEqual([]);
  });

  it('should navigate to detail', () => {
    component.navigateToRelatedEvents(dummyProgram);

    expect(navigate).toHaveBeenCalledWith(
      ['../../events'], { queryParams: { program_id: dummyProgram.id }, relativeTo: {} });
  });
});
