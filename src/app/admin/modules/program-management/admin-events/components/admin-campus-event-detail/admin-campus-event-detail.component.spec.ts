import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { AdminCampusEventDetailComponent } from './admin-campus-event-detail.component';
import { AppSharedCampusEventDetailStub } from 'src/testing/app-shared-campus-event-detail-stub';

describe('AdminCampusEventDetailComponent', () => {
  let component: AdminCampusEventDetailComponent;
  let fixture: ComponentFixture<AdminCampusEventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventDetailComponent,
        AppSharedCampusEventDetailStub
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
            data: observableOf({event: {
                id: 601,
                program: {
                  id: 1,
                  category_str: '青年教师助课',
                  epartment: '飞海科技',
                  name: '不过时候之间国际.',
                  category: 4
                },
                expired: false,
                enrolled: false,
                create_time: '2019-02-26T15:04:24.232265+08:00',
                update_time: '2019-02-26T15:04:24.232288+08:00',
                name: '介绍需要关系如此.',
                time: '2019-04-06T01:07:39.333288+08:00',
                location: '济南街D座',
                num_hours: 1.155832407467451,
                num_participants: 62,
                deadline: '2019-02-26T15:04:24.231857+08:00',
                num_enrolled: 0,
                description: '问题解决建设不同.所以任何下.',
              } as CampusEvent}),
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
