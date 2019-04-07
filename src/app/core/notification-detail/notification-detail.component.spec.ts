import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { MatCardModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { NotificationDetailComponent } from './notification-detail.component';
import { NotificationResponse } from 'src/app/shared/interfaces/notification';


describe('NotificationDetailComponent', () => {
  let component: NotificationDetailComponent;
  let fixture: ComponentFixture<NotificationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationDetailComponent,
      ],
      imports: [
        MatCardModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({notification: {
              id: 1,
              sender: 'sender',
              recipient: 'recipient',
              content: 'content',
              time: '2019-01-01',
              read_time: '2019-01-01',
            } as NotificationResponse}),
          },
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
