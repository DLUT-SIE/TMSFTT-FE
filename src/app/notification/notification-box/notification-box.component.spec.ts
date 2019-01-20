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
  const latestUnreadNotifications$ = new Subject<{}>();

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
  });
});
