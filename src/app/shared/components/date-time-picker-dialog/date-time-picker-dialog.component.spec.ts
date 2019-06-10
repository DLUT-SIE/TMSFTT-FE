import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DlDateTimePickerDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

import { DateTimePickerDialogComponent } from './date-time-picker-dialog.component';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('DateTimePickerDialogComponent', () => {
  let component: DateTimePickerDialogComponent;
  let fixture: ComponentFixture<DateTimePickerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DlDateTimePickerDateModule,
        DlDateTimePickerModule,
        FormsModule,
        MatDialogModule,
      ],
      declarations: [ DateTimePickerDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimePickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
