import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { of as observableOf } from 'rxjs';
import { MatCardModule, MatDividerModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { NotificationDetailComponent } from './notification-detail.component';
import { Notification } from 'src/app/shared/interfaces/notification';
import { DetailSectionActionsComponent } from 'src/app/shared/components/detail-section-actions/detail-section-actions.component';
import { DetailSectionComponent } from 'src/app/shared/components/detail-section/detail-section.component';
import { DetailItemComponent } from 'src/app/shared/components/detail-item/detail-item.component';
import { DetailItemTitleComponent } from 'src/app/shared/components/detail-item-title/detail-item-title.component';
import { DetailItemContentComponent } from 'src/app/shared/components/detail-item-content/detail-item-content.component';


describe('NotificationDetailComponent', () => {
  let component: NotificationDetailComponent;
  let fixture: ComponentFixture<NotificationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NotificationDetailComponent,
        DetailSectionComponent,
        DetailItemComponent,
        DetailItemTitleComponent,
        DetailItemContentComponent,
        DetailSectionActionsComponent,
      ],
      imports: [
        MatCardModule,
        MatDividerModule,
      ],
      providers: [
        {
          provide: Location,
          useValue: {
            back: () => {},
          },
        },
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
            } as Notification}),
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
