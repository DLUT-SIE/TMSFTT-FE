import { CampusEventListComponent } from './campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CampusEventResponse} from 'src/app/interfaces/event';
import { EventService } from '../../services/event.service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';


describe('CampusEventListComponent', () => {
  let component: CampusEventListComponent;
  let fixture: ComponentFixture<CampusEventListComponent>;
  let getEvents$: Subject<PaginatedResponse<CampusEventResponse>>;
  let getEvents: jasmine.Spy;
  const dummyEvent: CampusEventResponse = {
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
    program: 157,
    program_detail: {
      id: 157,
      name: '还是不是其中信息.',
      department: 77,
      category: 20,
      form: []
    },
  };

  beforeEach(async(() => {
    getEvents$ = new Subject<PaginatedResponse<CampusEventResponse>>();
    getEvents = jasmine.createSpy();
    getEvents .and.returnValue(getEvents$);
    TestBed.configureTestingModule({
      declarations: [
        CampusEventListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
        {
          provide: EventService,
          useValue: {
            getEvents: () => getEvents$,
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    const results: CampusEventResponse[] = [dummyEvent, dummyEvent];
    getEvents$.next({ count, results, next: '', previous: '' });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.events).toEqual(results);
    expect(component.eventlistLength).toEqual(count);
  });

  it('should empty data if an error encountered.', () => {
    getEvents$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.events).toEqual([]);
    expect(component.eventlistLength).toEqual(0);
  });
});
