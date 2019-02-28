import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { of as observableOf } from 'rxjs';
import { MatCardModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CampusEventResponse } from 'src/app/interfaces/event';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DetailComponent,
      ],
      imports: [
        MatCardModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: observableOf({item: {
              id: 601,
              create_time: '2019-02-26T15:04:24.232265+08:00',
              update_time: '2019-02-26T15:04:24.232288+08:00',
              name: '介绍需要关系如此.',
              time: '2019-04-06T01:07:39.333288+08:00',
              location: '济南街D座',
              num_hours: 1.155832407467451,
              num_participants: 62,
              deadline: '2019-02-26T15:04:24.231857+08:00',
              num_enrolled: 0,
              description: '问题解决是一对于营.内容她的北京发现项目经济更多.',
              program: 157
            } as CampusEventResponse}),
          },
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
