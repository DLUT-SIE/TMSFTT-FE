import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of as observableOf, throwError, Subject } from 'rxjs';

import { NotificationService } from './notification.service';
import { environment } from 'src/environments/environment';
import { NotificationResponse } from 'src/app/shared/interfaces/notification';
import { AUTH_SERVICE } from 'src/app/shared/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';

describe('NotificationService', () => {
  let httpTestingController: HttpTestingController;
  const dummyNotification: NotificationResponse = {
    id: 1,
    time: '2019-01-01',
    sender: 'sender',
    recipient: 'recipient',
    content: 'content',
    read_time: '2019-01-01',
  };

  const dummyResponse: PaginatedResponse<NotificationResponse> = {
    count: 100,
    next: 'next',
    previous: 'previous',
    results: [dummyNotification, dummyNotification],
  };
  const authenticationSucceed$ = new Subject<void>();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
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
    const url = `${environment.API_URL}/notifications/read/?${params}`;

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
    const url = `${environment.API_URL}/notifications/unread/?${params}`;

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

    getUnReadNotifications.and.returnValue(observableOf({ results: [{}, {}] }));

    tick(1000);

    expect(service.unreadNotifications.length).toBe(2);

    discardPeriodicTasks();
  }));

  it('should use default if no value provided', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.getNotifications({}).subscribe(
      data => {
        expect(data.results.length).toEqual(2);
      });

    const params = `limit=10&offset=0`;
    const url = `${environment.API_URL}/notifications/?${params}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyResponse);
  });

  it('should get notification', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    const id = 1;

    service.getNotification(id).subscribe();

    const url = `${environment.API_URL}/notifications/${id}/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush(dummyNotification);
  });

  it('should mark notifications as read.', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.markAllNotificationsAsRead().subscribe();

    const url = `${environment.API_URL}/notifications/actions/read-all/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should delete all notifications.', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.deleteAllNotifications().subscribe();

    const url = `${environment.API_URL}/notifications/actions/delete-all/`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

});
