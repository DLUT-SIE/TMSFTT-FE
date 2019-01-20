import { TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of as observableOf } from 'rxjs';

import { Notification, NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

describe('NotificationService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
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
    const readStatus = true;

    service.getNotifications(offset, limit, readStatus).subscribe(
      (res: {}) => {
        expect(res['results'].length).toEqual(2);
    });

    const url = `${environment.NOTIFICATION_SERVICE_URL}read-notifications/?offset=${offset}&limit=${limit}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ results: [{}, {}] as Notification[] });
  });

  it('should get unread notifications', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    const offset = 0;
    const limit = 20;
    const readStatus = false;

    service.getNotifications(offset, limit, readStatus).subscribe(
      (res: {}) => {
        expect(res['results'].length).toEqual(2);
    });

    const url = `${environment.NOTIFICATION_SERVICE_URL}unread-notifications/?offset=${offset}&limit=${limit}`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush({ results: [{}, {}] as Notification[] });
  });

  it('should provide latest unread notifications.', fakeAsync(() => {
    const service: NotificationService = TestBed.get(NotificationService);
    const getNotifications = spyOn(service, 'getNotifications');

    getNotifications.and.returnValue(observableOf({ results: [{}, {}] }));

    service.latestUnreadNotifications$.subscribe(notes => {
      expect(notes['results'].length).toBe(2);
    });

    tick(1000);

    discardPeriodicTasks();
  }));

  it('should use default if no value provided', () => {
    const service: NotificationService = TestBed.get(NotificationService);

    service.getNotifications().subscribe(
      (notifications: Notification[]) => {
        expect(notifications.length).toEqual(2);
    });

    const url = `${environment.NOTIFICATION_SERVICE_URL}?offset=0&limit=20`;

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([{}, {}] as Notification[]);
  });
});
