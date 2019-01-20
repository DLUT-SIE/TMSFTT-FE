import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatProgressSpinnerModule,
} from '@angular/material';
import { Subject } from 'rxjs';

import { NotificationBoxComponent } from './notification-box.component';
import { Notification, NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification-box-card',
  template: '<p>Mock card</p>',
})
class TestNotificationBoxCardComponent {
  /** Input for mock card. */
  @Input() notification: Notification;
}

describe('NotificationBoxComponent', () => {
  let component: NotificationBoxComponent;
  let fixture: ComponentFixture<NotificationBoxComponent>;
  const latestUnreadNotifications$ = new Subject<Notification[]>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationBoxComponent,
        TestNotificationBoxCardComponent,
      ],
      imports: [
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            latestUnreadNotifications$,
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.notificationsLoaded).toBeFalsy();
  });

  it('should create box cards.', () => {
    latestUnreadNotifications$.next([
      {
        sender: 'sender',
        recipient: 'recipient',
        content: 'content',
        time: '2019-01-01',
      },
      {
        sender: 'sender',
        recipient: 'recipient',
        content: 'content',
        time: '2019-01-01',
      },
    ]);

    fixture.detectChanges();

    expect(component.notificationsLoaded).toBeTruthy();
    expect(component.notifications.length).toBe(2);
  });
});
