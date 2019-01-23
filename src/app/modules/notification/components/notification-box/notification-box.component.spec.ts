import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';

import { NotificationBoxComponent } from './notification-box.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-box-card',
  template: '<p>Mock card</p>',
})
class TestNotificationBoxCardComponent {
  /** Input for mock card. */
  @Input() notification: Notification;
  @Input() dialogRef: MatDialogRef<{}>;
}

// tslint:disable:component-selector
@Component({
  selector: 'mat-spinner',
  template: '<p>Mock spinner</p>',
})
class StubMatSpinnerComponent { }
// tslint:enable:component-selector


describe('NotificationBoxComponent', () => {
  let component: NotificationBoxComponent;
  let fixture: ComponentFixture<NotificationBoxComponent>;
  let close: jasmine.Spy;
  const latestUnreadNotifications$ = new Subject<{}>();

  beforeEach(async(() => {
    close = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        NotificationBoxComponent,
        StubMatSpinnerComponent,
        TestNotificationBoxCardComponent,
      ],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            latestUnreadNotifications$,
          }
        },
        {
          provide: MatDialogRef,
          useValue: {
            close,
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
