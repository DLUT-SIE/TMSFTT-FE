import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';

import { NotificationBoxCardComponent } from './notification-box-card.component';
import { Notification } from '../../services/notification/notification.service';


@Component({
  selector: 'app-test-notification-box-card',
  template: '<app-notification-box-card [notification]="notification"></app-notification-box-card>',
})
class TestNotificationBoxCardComponent {
  /** Mock notification */
  notification: Notification = {
    content: 'content',
    sender: 'sender',
    recipient: 'recipient',
    time: '2019-01-01',
  };
}

describe('NotificationBoxCardComponent', () => {
  let component: NotificationBoxCardComponent;
  let fixture: ComponentFixture<TestNotificationBoxCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationBoxCardComponent,
        TestNotificationBoxCardComponent,
       ],
      imports: [
        MatCardModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNotificationBoxCardComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
