import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { BatchSubmitComponent } from './batch-submit.component';
import { RecordService } from '../../services/record.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('BatchSubmitComponent', () => {
  let component: BatchSubmitComponent;
  let fixture: ComponentFixture<BatchSubmitComponent>;
  let BatchSubmitRecord$: Subject<{'count': number}>;
  let snackBarOpen: jasmine.Spy;
  const tmpfile = new File([],'a.xlsx');

  beforeEach(async(() => {
    snackBarOpen = jasmine.createSpy();
    BatchSubmitRecord$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [ BatchSubmitComponent ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: RecordService,
          useValue: {
            BatchSubmitRecord: () => BatchSubmitRecord$,
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onFileSlect when button is clicked.', () => {
    fixture.detectChanges();
    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    fileInput.triggerEventHandler('change', {
      target: {
        files: [tmpfile],
      }
    });

    expect(component.file).toBe(tmpfile);
    expect(component.flag).toBe(false);
  });

  it('should display errors when creation failed.', () => {
    component.uploadFile();
    BatchSubmitRecord$.error({
      message: 'Raw error message',
      error: {
        detail: 'Invalid number of attachments',
      },
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Invalid number of attachments。', '关闭');
  });

  it('should display raw errors when creation failed.', () => {
    component.uploadFile();
    BatchSubmitRecord$.error({
      message: 'Raw error message',
    } as HttpErrorResponse);

    expect(snackBarOpen).toHaveBeenCalledWith('Raw error message', '关闭');
  });

  it('should display count when creation successed.', () => {
    component.uploadFile();
    BatchSubmitRecord$.next({
      'count': 4
    } as {'count': number});

    expect(component.count).toBe(4);
    expect(component.flag).toBe(true);
  }); 
});
