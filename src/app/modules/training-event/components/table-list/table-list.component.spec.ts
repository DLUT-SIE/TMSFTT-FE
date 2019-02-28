import { TableListComponent } from './table-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CampusEventResponse} from 'src/app/interfaces/event';
import { EventService } from '../../services/event.service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';


describe('TableListComponent', () => {
  let component: TableListComponent;
  let fixture: ComponentFixture<TableListComponent>;
  let getEvents$: Subject<PaginatedResponse<CampusEventResponse>>;
  let navigate: jasmine.Spy;
  let getEvents: jasmine.Spy;
  // let markAllNotificationsAsRead: jasmine.Spy;
  // let deleteAllNotifications: jasmine.Spy;
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
    program: 157
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getEvents$ = new Subject<PaginatedResponse<CampusEventResponse>>();
    getEvents = jasmine.createSpy();
    getEvents .and.returnValue(getEvents$);
    // markAllNotificationsAsRead = jasmine.createSpy();
    // deleteAllNotifications = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        TableListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            userID: 1,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {},
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
            getEvents,
            // markAllNotificationsAsRead,
            // deleteAllNotifications,
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
    fixture = TestBed.createComponent(TableListComponent);
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

  it('should navigate to detail', () => {
    component.navigateToDetail(dummyEvent);

    expect(navigate).toHaveBeenCalledWith(
      ['.', dummyEvent.id], { relativeTo: {}});
  });


});
