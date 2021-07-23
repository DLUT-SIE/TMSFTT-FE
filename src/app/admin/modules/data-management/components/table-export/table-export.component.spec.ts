import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableExportComponent } from './table-export.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBar, MatFormFieldModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { WindowService } from 'src/app/shared/services/window.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubOptionsConfig, programRequiredValidator } from './table-export.component';
import { Department } from 'src/app/shared/interfaces/department';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { Program } from 'src/app/shared/interfaces/program';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';

describe('TableExportComponent', () => {
  let component: TableExportComponent;
  let fixture: ComponentFixture<TableExportComponent>;
  let exportTableSubject$ = new Subject<{'url': string}>();
  let snackBarOpen: jasmine.Spy;
  let windowOpen: jasmine.Spy;
  let buildUrl: jasmine.Spy;
  let getTopDepartment$: Subject<Department[]>;
  let getPrograms$: Subject<Program[]>;
  beforeEach(async(() => {
    exportTableSubject$ = new Subject<{'url': string}>();
    snackBarOpen = jasmine.createSpy();
    windowOpen = jasmine.createSpy();
    getTopDepartment$ = new Subject();
    getPrograms$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [ TableExportComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        BrowserAnimationsModule
      ],
      providers: [
        {
          provide: TableExportService,
          useValue: {
            exportTable: () => exportTableSubject$,
          }
        },
        {
          provide: DepartmentService,
          useValue: {
            getTopDepartments: () => getTopDepartment$,
          }
        },
        {
          provide: ProgramService,
          useValue: {
            getPrograms: () => getPrograms$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          }
        },
        {
          provide: WindowService,
          useValue: {
            open: windowOpen,
          }
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            isSchoolAdmin: true,
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should occure error', () => {
    buildUrl = spyOn(component, 'buildUrl');
    component.doTableExport();
    exportTableSubject$.error({
      status: 400,
      error: {detail: 'Raw error message'},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭');
    expect(buildUrl).toHaveBeenCalled();
  });

  it('should load data', () => {
    buildUrl = spyOn(component, 'buildUrl');
    component.doTableExport();
    exportTableSubject$.next({
      url: '/path/to/file',
    } as {url: string});
    expect(buildUrl).toHaveBeenCalled();
    expect(windowOpen).toHaveBeenCalledWith('/path/to/file');
    expect(snackBarOpen).toHaveBeenCalledWith('导出成功', '确定', {duration: 3000});
  });

  it('should build url', () => {
    component.choosedTable = {
      id: 1,
      name: 'abc',
    };
    component.exportTableOptions.setValue({
      selectedDepartment: {id: 1},
      endTime: new Date('2016-01-01'),
      startTime: new Date('2016-01-01'),
      selectedTable: [],
      selectedProgram: {id: 1},
    });
    component.subOptionsConfig = new SubOptionsConfig(0b0000);

    let url: string = component.buildUrl();

    expect(url).toEqual(
      `/aggregate-data/table-export/?table_type=1&table_name=abc`);

    component.subOptionsConfig = new SubOptionsConfig(0b1111);

    url = component.buildUrl();

    expect(url).toEqual(
      `/aggregate-data/table-export/?table_type=1&table_name=abc&department_id=1&program_id=1&start_time=2016-01-01T00:00:00.000Z&end_time=2016-01-01T00:00:00.000Z`);
  });

  it('should get departments', () => {
    component.departmentsData = [];
    component.getDepartments();

    getTopDepartment$.next([{}]);

    expect(component.departmentsData).toEqual([{}]);
  });

  it('should get programs', () => {
    component.programsData = [];
    component.programsList = [];
    component.getPrograms();

    getPrograms$.next([{}]);

    expect(component.programsData).toEqual([{}]);
    expect(component.programsList).toEqual([{}]);
  });

  it('should validate program', () => {

    component.exportTableOptions.setValue({
      selectedDepartment: {id: 1},
      endTime: new Date('2016-01-01'),
      startTime: new Date('2016-01-01'),
      selectedTable: [],
      selectedProgram: {id: 1},
    });

    const program = programRequiredValidator(component.exportTableOptions);

    expect(program).toEqual(null);

  });
});
