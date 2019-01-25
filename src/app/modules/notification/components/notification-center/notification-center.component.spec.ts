import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { of as observableOf, Subject } from 'rxjs';

import { PaginatedNotificationResponse, NotificationResponse } from 'src/app/interfaces/notification';
import { NotificationService } from '../../services/notification.service';
import { NotificationCenterComponent } from './notification-center.component';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';

describe('NotificationCenterComponent', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;
  let getNotifications$: Subject<PaginatedNotificationResponse>;
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
    getNotifications$ = new Subject<PaginatedNotificationResponse>();
    getNotifications = jasmine.createSpy();
    getNotifications.and.returnValue(getNotifications$);
    markAllNotificationsAsRead = jasmine.createSpy();
    deleteAllNotifications = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        NotificationCenterComponent,
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
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
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
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    const results: NotificationResponse[] = [dummyNotification, dummyNotification];
    getNotifications$.next({ count, results } as PaginatedNotificationResponse);

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.notifications).toEqual(results);
    expect(component.notificationsLength).toEqual(count);
  });

  it('should empty data if an error encountered.', () => {
    getNotifications$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.notifications).toEqual([]);
    expect(component.notificationsLength).toEqual(0);
  });

  it('should navigate to detail', () => {
    component.navigateToDetail(dummyNotification);

    expect(navigate).toHaveBeenCalledWith(
      ['.', dummyNotification.id], { relativeTo: {}});
  });

  it('should mark all notifications as read', () => {
    const count = 100;
    const results: NotificationResponse[] = [dummyNotification, dummyNotification];
    getNotifications$.next({ count, results } as PaginatedNotificationResponse);
    markAllNotificationsAsRead.and.returnValue(observableOf(null));

    component.markAllAsRead();

    expect(markAllNotificationsAsRead).toHaveBeenCalled();
    expect(getNotifications).toHaveBeenCalledTimes(2);
  });

  it('should delete all notifications.', () => {
    const count = 100;
    const results: NotificationResponse[] = [dummyNotification, dummyNotification];
    getNotifications$.next({ count, results } as PaginatedNotificationResponse);
    deleteAllNotifications.and.returnValue(observableOf(null));

    component.deleteAll();

    expect(deleteAllNotifications).toHaveBeenCalled();
    expect(getNotifications).toHaveBeenCalledTimes(2);
  });


});
