import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, Subject } from 'rxjs';

import { NotificationResponse } from 'src/app/shared/interfaces/notification';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationListComponent } from './notification-list.component';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { Location } from '@angular/common';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;
  let getNotifications$: Subject<PaginatedResponse<NotificationResponse>>;
  let navigate: jasmine.Spy;
  let getNotifications: jasmine.Spy;
  let markAllNotificationsAsRead: jasmine.Spy;
  let deleteAllNotifications: jasmine.Spy;
  const dummyNotification: NotificationResponse = {
    id: 2,
    time: '2019-01-01',
    sender: 'sender',
    recipient: 'recipient',
    content: 'content',
    read_time: '2019-01-01',
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getNotifications$ = new Subject<PaginatedResponse<NotificationResponse>>();
    getNotifications = jasmine.createSpy();
    getNotifications.and.returnValue(getNotifications$);
    markAllNotificationsAsRead = jasmine.createSpy();
    deleteAllNotifications = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        NotificationListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            }
          },
        },
        {
          provide: Router,
          useValue: {
            navigate,
            createUrlTree: () => 'abc',
          },
        },
        {
          provide: NotificationService,
          useValue: {
            getNotifications,
            markAllNotificationsAsRead,
            deleteAllNotifications,
          }
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all notifications as read', () => {
    const count = 100;
    const results: NotificationResponse[] = [dummyNotification, dummyNotification];
    const forceRefresh = spyOn(component, 'forceRefresh');
    getNotifications$.next({ count, results, next: '', previous: '' });
    markAllNotificationsAsRead.and.returnValue(observableOf(null));

    component.markAllAsRead();

    expect(markAllNotificationsAsRead).toHaveBeenCalled();
    expect(forceRefresh).toHaveBeenCalled();
  });

  it('should delete all notifications.', () => {
    const count = 100;
    const results: NotificationResponse[] = [dummyNotification, dummyNotification];
    const forceRefresh = spyOn(component, 'forceRefresh');
    getNotifications$.next({ count, results, next: '', previous: '' });
    deleteAllNotifications.and.returnValue(observableOf(null));

    component.deleteAll();

    expect(deleteAllNotifications).toHaveBeenCalled();
    expect(forceRefresh).toHaveBeenCalled();
  });
});
