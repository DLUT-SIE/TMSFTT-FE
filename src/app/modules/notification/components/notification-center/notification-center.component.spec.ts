import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { PaginatedNotificationResponse, NotificationResponse } from 'src/app/interfaces/notification';
import { NotificationService } from '../../services/notification.service';
import { NotificationCenterComponent } from './notification-center.component';

describe('NotificationCenterComponent', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;
  const getNotifications$ = new Subject<PaginatedNotificationResponse>();
  let navigate: jasmine.Spy;
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
    TestBed.configureTestingModule({
      declarations: [
        NotificationCenterComponent,
      ],
      imports: [
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
      ],
      providers: [
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
            getNotifications: () => getNotifications$,
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
});
