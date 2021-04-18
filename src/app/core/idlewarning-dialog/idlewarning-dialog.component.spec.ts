import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleWarningDialogComponent } from './idlewarning-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material';

describe('IdleWarningDialogComponent', () => {
  let component: IdleWarningDialogComponent;
  let fixture: ComponentFixture<IdleWarningDialogComponent>;
  let close: jasmine.Spy;

  beforeEach(async(() => {
    close = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      declarations: [IdleWarningDialogComponent],
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
    fixture = TestBed.createComponent(IdleWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
