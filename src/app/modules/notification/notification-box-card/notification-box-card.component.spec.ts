import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { NotificationBoxCardComponent } from './notification-box-card.component';
import { NotificationResponse } from 'src/app/interfaces/notification';


@Component({
  selector: 'app-test-notification-box-card',
  template: '<app-notification-box-card [notification]="notification" [dialogRef]="dialogRef"></app-notification-box-card>',
})
class TestNotificationBoxCardComponent {
  /** Mock notification */
  notification: NotificationResponse = {
    id: 5,
    content: 'content',
    sender: 'sender',
    recipient: 'recipient',
    time: '2019-01-01',
    read_time: null,
  };
  dialogRef = jasmine.createSpy();
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
        RouterTestingModule,
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