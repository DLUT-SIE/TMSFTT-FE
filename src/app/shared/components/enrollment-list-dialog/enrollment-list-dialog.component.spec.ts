import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentListDialogComponent } from './enrollment-list-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('EnrollmentListDialogComponent', () => {
  let component: EnrollmentListDialogComponent;
  let fixture: ComponentFixture<EnrollmentListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentListDialogComponent ],
      imports: [
        MatDialogModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            enrollments: [],
            event: {},
          },
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
