import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA,
         MatDialogRef,
         MatDialogModule,
         MatInputModule,
         MatFormFieldModule,
         MatButtonModule,
         MatSelectModule,
        } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FeedbackDialogComponent } from './feedback-dialog.component';

describe('FeedbackDialogComponent', () => {
  let component: FeedbackDialogComponent;
  let fixture: ComponentFixture<FeedbackDialogComponent>;
  let close: jasmine.Spy;

  beforeEach(async(() => {
    close = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ FeedbackDialogComponent ],
      imports: [
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        MatButtonModule,
        FormsModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            feedback: '123',
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close,
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close when cancle it', () => {
    component.onNoClick();

    expect(close).toHaveBeenCalled();
  });
});
