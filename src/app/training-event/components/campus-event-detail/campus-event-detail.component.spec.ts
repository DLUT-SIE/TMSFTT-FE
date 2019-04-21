import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { CampusEventDetailComponent } from './campus-event-detail.component';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

describe('CampusEventDetailComponent', () => {
  let component: CampusEventDetailComponent;
  let fixture: ComponentFixture<CampusEventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampusEventDetailComponent
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({item: {
                id: 601,
                program_detail: {
                  id: 157,
                  department_detail: {
                    id: 77,
                    create_time: '2019-02-26T15:04:23.596821+08:00',
                    update_time: '2019-02-26T15:04:23.628167+08:00',
                    name: '七喜',
                    admins: [
                      12
                    ]
                  },
                  category_detail: {
                    id: 20,
                    name: '其他'
                  },
                  name: '还是不是其中信息.',
                  department: 77,
                  category: 20,
                  form: []
                },
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
                program: 157
              } as CampusEvent}),
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
