import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Program } from 'src/app/shared/interfaces/program';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { AdminProgramListComponent } from './admin-program-list.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Department } from 'src/app/shared/interfaces/department';

describe('AdminProgramListComponent', () => {
  let component: AdminProgramListComponent;
  let fixture: ComponentFixture<AdminProgramListComponent>;
  let getPrograms$: Subject<Program[]>;
  let getTopDepartments$: Subject<Department[]>;
  let navigate: jasmine.Spy;
  let getPrograms: jasmine.Spy;
  let getTopDepartments: jasmine.Spy;
  const dummyProgram: Program = {
    id: 1,
    name: 'sender',
    department: 4,
    category: 3,
    form: [],
  };
  const dummyDepartment: Department = {
    id: 4,
    name: '大连理工大学',
    admins: [],
    users: [],
    super_department: null,
  };

  const dummySuperDepartment: Department = {
    id: 2,
    name: '凌水主校区',
    admins: [],
    users: [],
    super_department: 3,
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getPrograms$ = new Subject<Program[]>();
    getPrograms = jasmine.createSpy();
    getPrograms.and.returnValue(getPrograms$);
    getTopDepartments$ = new Subject<Department[]>();
    getTopDepartments = jasmine.createSpy();
    getTopDepartments.and.returnValue(getTopDepartments$);
    TestBed.configureTestingModule({
      declarations: [
        AdminProgramListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
            isSchoolAdmin: true,
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
          provide: DepartmentService,
          useValue: {
            getTopDepartments,
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

  it('should load programs', () => {
    component.loadProgramsBelongToDepartment(dummyDepartment.id);
    getPrograms$.next([dummyProgram]);

    expect(component.programs).toEqual([dummyProgram]);
  });

  it('should load departments', () => {
    getTopDepartments$.next([dummyDepartment, dummySuperDepartment]);

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.departments.length).toEqual(2);
  });

  it('should empty data if an error encountered.', () => {
    getTopDepartments$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.departments).toEqual([]);
  });

  it('should navigate to detail', () => {
    component.navigateToRelatedEvents(dummyProgram);

    expect(navigate).toHaveBeenCalledWith(
      ['../../events'], { queryParams: { program_id: dummyProgram.id }, relativeTo: {} });
  });
});

describe('NotSchoolAdminAdminProgramListComponent', () => {
  let component: AdminProgramListComponent;
  let fixture: ComponentFixture<AdminProgramListComponent>;
  let navigate: jasmine.Spy;
  let getPrograms$: Subject<Program[]>;
  let getPrograms: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getPrograms$ = new Subject<Program[]>();
    getPrograms = jasmine.createSpy();
    getPrograms.and.returnValue(getPrograms$);
    TestBed.configureTestingModule({
      declarations: [
        AdminProgramListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
            isSchoolAdmin: false,
          },
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: ProgramService,
          useValue: {
            getPrograms,
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
  it('should convert to loadProgramsBelongToDepartment', () => {

    expect(component.isLoadingResults).toBeFalsy();
  });
});
