import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of as observableOf, throwError, Subject } from 'rxjs';

import { NotificationService } from './notification.service';
import { Notification } from 'src/app/shared/interfaces/notification';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { MatSnackBarModule, MatSnackBar } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';

describe('NotificationService', () => {
  let httpTestingController: HttpTestingController;
  let open: jasmine.Spy;
  const dummyNotification: Notification = {
    id: 1,
    time: '2019-01-01',
    sender: 'sender',
    recipient: 'recipient',
    content: 'content',
    read_time: '2019-01-01',
  };

  const dummyResponse: PaginatedResponse<Notification> = {
    count: 100,
    next: 'next',
    previous: 'previous',
    results: [dummyNotification, dummyNotification],
  };
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(() => {
    open = jasmine.createSpy();
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            authenticationSucceed: authenticationSucceed$,
            isAuthenticated: true,
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open,
          },
        },
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });

  it('should get read notifications', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    const offset = 0;
    const limit = 20;

    service.getReadNotifications({offset, limit}).subscribe(
      res => { expect(res.results.length).toEqual(2); });

    const params = `limit=${limit}&offset=${offset}`;
    const url = `/notifications/read/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should get unread notifications', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    const offset = 0;
    const limit = 20;

    service.getUnReadNotifications({offset, limit}).subscribe(
      (res: {}) => {
        expect(res['results'].length).toEqual(2);
      });

    const params = `limit=${limit}&offset=${offset}`;
    const url = `/notifications/unread/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should ignore errors during getting notifications', fakeAsync(() => {
    const service: NotificationService = TestBed.get(NotificationService);
    authenticationSucceed$.next();
    const getUnReadNotifications = spyOn(service, 'getUnReadNotifications');

    getUnReadNotifications.and.returnValue(throwError('error'));

    tick(1000);

    expect(service.unreadNotificationsLoaded).toBeTruthy();

    discardPeriodicTasks();
  }));

  it('should provide latest unread notifications.', fakeAsync(() => {
    const service: NotificationService = TestBed.get(NotificationService);
    authenticationSucceed$.next();
    const getUnReadNotifications = spyOn(service, 'getUnReadNotifications');

    getUnReadNotifications.and.returnValue(observableOf({ count: 20, results: [{id: 1}, {}] }));

    tick();

    expect(service.unreadNotifications.length).toBe(2);
    expect(service.unreadNotificationsLength).toBe(20);
    expect(open).toHaveBeenCalled();

    getUnReadNotifications.and.returnValue(observableOf({ count: 10, results: [{id: 5}] }));

    tick(environment.REFRESH_INTERVAL);

    expect(service.unreadNotifications.length).toBe(1);
    expect(service.unreadNotificationsLength).toBe(10);
    expect(open).toHaveBeenCalledTimes(2);

    discardPeriodicTasks();
  }));

  it('should use default if no value provided', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.getNotifications({}).subscribe(
      data => {
        expect(data.results.length).toEqual(2);
      });

    const params = `limit=10&offset=0`;
    const url = `/notifications/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should get notification', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    const id = 1;

    service.getNotification(id).subscribe();

    const url = `/notifications/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyNotification);
  });

  it('should mark notifications as read.', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.markAllNotificationsAsRead().subscribe();

    const url = `/notifications/mark-all-as-read/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

});
