import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableExportComponent } from './table-export.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('TableExportComponent', () => {
  let component: TableExportComponent;
  let fixture: ComponentFixture<TableExportComponent>;
  let exportTableSubject$ = new Subject<{'url': string}>();
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    exportTableSubject$ = new Subject<{'url': string}>();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ TableExportComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        {
          provide: TableExportService,
          useValue: {
            exportTable: () => exportTableSubject$,
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          }
        },
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
    component.doTableExport();
    exportTableSubject$.error({
      statusText: 'Raw error message',
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalled();
    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

  it('should load data', () => {
    component.doTableExport();
    exportTableSubject$.next({
      url: '/path/to/file',
    } as {url: string});
    expect(snackBarOpen).toHaveBeenCalled();
    expect(snackBarOpen).toHaveBeenCalledWith('导出成功', '确定', {duration: 3000});
  });
});
