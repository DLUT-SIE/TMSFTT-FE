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


describe('TableExportComponent', () => {
  let component: TableExportComponent;
  let fixture: ComponentFixture<TableExportComponent>;
  let exportTableSubject$ = new Subject<{'url': string}>();
  let snackBarOpen: jasmine.Spy;
  let windowOpen: jasmine.Spy;
  let buildUrl: jasmine.Spy;
  beforeEach(async(() => {
    exportTableSubject$ = new Subject<{'url': string}>();
    snackBarOpen = jasmine.createSpy();
    windowOpen = jasmine.createSpy();
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExportComponent);
    component = fixture.componentInstance;
    buildUrl = spyOn(component, 'buildUrl');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should occure error', () => {
    component.doTableExport();
    exportTableSubject$.error({
      error: {detail: 'Raw error message'},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
    expect(buildUrl).toHaveBeenCalled();
  });

  it('should load data', () => {
    component.doTableExport();
    exportTableSubject$.next({
      url: '/path/to/file',
    } as {url: string});
    expect(buildUrl).toHaveBeenCalled();
    expect(windowOpen).toHaveBeenCalledWith('/path/to/file');
    expect(snackBarOpen).toHaveBeenCalledWith('导出成功', '确定', {duration: 3000});
  });
});
