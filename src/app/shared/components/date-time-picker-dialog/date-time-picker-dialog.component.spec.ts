import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DlDateTimePickerDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

import { DateTimePickerDialogComponent } from './date-time-picker-dialog.component';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('DateTimePickerDialogComponent', () => {
  let component: DateTimePickerDialogComponent;
  let fixture: ComponentFixture<DateTimePickerDialogComponent>;
  let dialogRefClose: jasmine.Spy;

  beforeEach(async(() => {
    dialogRefClose = jasmine.createSpy();
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
          useValue: {
            close: dialogRefClose,
          },
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

  it('should colse with date if no selected', () => {
    component.selectedDate = '';

    component.closeWithDate();

    expect(dialogRefClose).toHaveBeenCalledWith();
  });

  it('should close with date', () => {
    component.selectedDate = '123';
    spyOn(component.datePipe, 'transform').and.returnValue('abc');

    component.closeWithDate();

    expect(dialogRefClose).toHaveBeenCalledWith('abc');

  });
});
