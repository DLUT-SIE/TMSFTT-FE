import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA,
         MatDialogRef,
         MatDialogModule,
         MatInputModule,
         MatFormFieldModule,
         MatButtonModule,
        } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { AdduserDialogComponent } from './adduser-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdduserDialogComponent', () => {
  let component: AdduserDialogComponent;
  let fixture: ComponentFixture<AdduserDialogComponent>;
  let close: jasmine.Spy;

  beforeEach(async(() => {
    close = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [ AdduserDialogComponent ],
      imports: [
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        MatButtonModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            username: 'name',
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
    fixture = TestBed.createComponent(AdduserDialogComponent);
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
