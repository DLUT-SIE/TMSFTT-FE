import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementComponent } from './user-management.component';
import { FormsModule } from '@angular/forms';
import {
  MatFormFieldModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSnackBar,
  MatInputModule,
  MatChipsModule,
  MatDividerModule,
} from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { User } from 'src/app/shared/interfaces/user';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let getUserByUsername$: Subject<PaginatedResponse<User>>;
  let getGroupsByIds$: Subject<{}>;
  let snackBarOpen: jasmine.Spy;

  beforeEach(async(() => {
    getUserByUsername$ = new Subject();
    getGroupsByIds$ = new Subject();
    snackBarOpen = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        UserManagementComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionComponent,
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
          provide: GroupService,
          useValue: {
            getGroupsByIds: () => getGroupsByIds$,
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
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
    getGroupsByIds$.next({});
    expect(component.isLoading).toBeFalsy();
  });

  it('should get empty groups.', () => {
    component.username = 'abc';
    component.retrieveUserPermissions();

    getUserByUsername$.next({ count: 1, previous: '', next: '', results: [{ id: 1, groups: []} as User] });
    getGroupsByIds$.next({});

    expect(component.groups.length).toBe(0);
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

});
