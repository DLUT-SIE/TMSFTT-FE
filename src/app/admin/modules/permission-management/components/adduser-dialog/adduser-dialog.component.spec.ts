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
import { User } from 'src/app/shared/interfaces/user';
import { UserService } from 'src/app/shared/services/user.service';
import { Subject } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('AdduserDialogComponent', () => {
  let component: AdduserDialogComponent;
  let fixture: ComponentFixture<AdduserDialogComponent>;
  let close: jasmine.Spy;
  let getUserByUsername$: Subject<PaginatedResponse<User>>;
  beforeEach(async(() => {
    getUserByUsername$ = new Subject();
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
          provide: UserService,
          useValue: {
            getUserByUsername: () => getUserByUsername$,
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

  it('should retrieve User', () => {
    component.retrieveUser();
    expect(component.isLoading).toBeTruthy();

    getUserByUsername$.next({ count: 1, previous: '', next: '', results: [{ id: 1, groups: [1, 2]} as User] });

    expect(component.isLoading).toBeFalsy();
  });

});
