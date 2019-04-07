import { AdminCampusEventListComponent } from './admin-campus-event-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject  } from 'rxjs';
import { CampusEventResponse } from 'src/app/shared/interfaces/event';
import { EventService } from '../../services/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';

describe('AdminCampusEventListComponent', () => {
  let component: AdminCampusEventListComponent;
  let fixture: ComponentFixture<AdminCampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEventResponse>>;
  let getCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;

  const dummyEvent: CampusEventResponse = {
    id: 4,
    create_time: '2019-04-04T18:34:54.760836+08:00',
    update_time: '2019-02-26T15:04:24.232288+08:00',
    name: '为了关于社会下载.',
    time: '2019-06-01T07:12:09.042681+08:00',
    location: '邯郸路i座',
    num_hours:  0.17651134923455114,
    num_participants: 15,
    deadline: '2019-04-04T18:34:54.760492+08:00',
    num_enrolled: 0,
    description: '数据网上朋友要求她的继续显示.拥有更多只有美国.\n能力设计无法加入国内政府状态.地址可以部门时间.',
    program: 1,
    program_detail: {
      id: 1,
      name: '精芯',
      department: 1,
      category: 4,
      department_detail: {
        id: 1,
        create_time: '2019-04-04T18:34:54.557369+08:00',
        update_time: '2019-04-04T18:34:54.557421+08:00',
        name: '精芯',
        admins: [],
      },
      category_detail: {
        id: 4,
        name: '青年教师助课',
      },
      form: [],
    },
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEventResponse>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);
    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: observableOf({program_id: 1})
          }
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: EventService,
          useValue: {
            getCampusEvents: () => getCampusEvents$,
          }
        },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => { }),
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data', () => {
    const count = 100;
    const results: CampusEventResponse[] = [dummyEvent, dummyEvent];
    getCampusEvents$.next({ count, results, next: '', previous: '' });

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.results).toEqual(results);
    expect(component.resultsLength).toEqual(count);
  });

  it('should empty data if an error encountered.', () => {
    getCampusEvents$.error('error');

    expect(component.isLoadingResults).toBeFalsy();
    expect(component.results).toEqual([]);
    expect(component.resultsLength).toEqual(0);
  });
});
