
import { AdminCloseRecordsComponent } from './admin-close-records.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSnackBar,
  MatInputModule,
  MatChipsModule,
  MatDividerModule,
} from '@angular/material';
import { User } from 'src/app/shared/interfaces/user';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { RecordService } from 'src/app/shared/services/records/record.service';
import { Record } from 'src/app/shared/interfaces/record';

describe('AdminCloseRecordsComponent', () => {
  let component: AdminCloseRecordsComponent;
  let fixture: ComponentFixture<AdminCloseRecordsComponent>;
  let getUserByUsername$: Subject<PaginatedResponse<User>>;
  let snackBarOpen: jasmine.Spy;
  let forceCloseRecord$: Subject<Record>;

  beforeEach(async(() => {
    getUserByUsername$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    forceCloseRecord$ = new Subject();
    TestBed.configureTestingModule({
      declarations: [
        AdminCloseRecordsComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionComponent,
        DetailSectionActionsComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatChipsModule,
        MatCheckboxModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: snackBarOpen,
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByUsername: () => getUserByUsername$,
          }
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
              params: {
                id: 1,
              },
              queryParams: {
                event_id: '1',
              },
            }
          },
        },
        {
          provide: RecordService,
          useValue: {
            forceCloseRecord: () => forceCloseRecord$,
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCloseRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve user permissions.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();

    expect(component.isLoading).toBeTruthy();

    getUserByUsername$.next({ count: 1, previous: '', next: '', results: [{ id: 1, groups: [1, 2]} as User] });
    expect(component.isLoading).toBeFalsy();
  });

  it('should display error message.', () => {
    component.username = 'abc';
    const errorMessage = '系统中无此用户!';
    component.retrieveUserPermissions();

    expect(component.isLoading).toBeTruthy();
    getUserByUsername$.next({count: 0, results: [], previous: '', next: ''});

    expect(component.isLoading).toBeFalsy();
    expect(component.errorMessage).toEqual(errorMessage);
  });

  it('should close record', () => {
    component.eventId = 1;
    component.user = {id: 1};
    component.closeRecord();
    forceCloseRecord$.next({id: 1});
    expect(snackBarOpen).toHaveBeenCalledWith('关闭记录成功!', '关闭', {duration: 3000});
    component.closeRecord();
    forceCloseRecord$.error({
      status: 400,
      error: {detail: ['Raw error message']},
    } as HttpErrorResponse);
    expect(snackBarOpen).toHaveBeenCalledWith('失败原因： Raw error message', '关闭', {duration: 3000});
  });

});
