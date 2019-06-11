import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IEWarningDialogComponent } from './iewarning-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material';

describe('IEWarningDialogComponent', () => {
  let component: IEWarningDialogComponent;
  let fixture: ComponentFixture<IEWarningDialogComponent>;
  let close: jasmine.Spy;

  beforeEach(async(() => {
    close = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      declarations: [IEWarningDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close,
          }
        }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IEWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
