import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { of as observableOf, Subject } from 'rxjs';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Program } from 'src/app/shared/interfaces/program';
import { EventService } from 'src/app/shared/services/events/event.service';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { EventListType } from '../../enums/event-list-type.enum';
import { SharedCampusEventListComponent } from './shared-campus-event-list.component';

describe('SharedCampusEventListComponent', () => {
  let component: SharedCampusEventListComponent;
  let fixture: ComponentFixture<SharedCampusEventListComponent>;
  let getCampusEvents$: Subject<PaginatedResponse<CampusEvent>>;
  let getCampusEvents: jasmine.Spy;
  let navigate: jasmine.Spy;
  const route = {
    queryParams: observableOf({ program_id: 1 }),
    snapshot: {
      queryParamMap: {
        get: () => '1',
      },
    }
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    getCampusEvents$ = new Subject<PaginatedResponse<CampusEvent>>();
    getCampusEvents = jasmine.createSpy();
    getCampusEvents.and.returnValue(getCampusEvents$);

    TestBed.configureTestingModule({
      declarations: [
        SharedCampusEventListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: route,
        },
        {
          provide: Location,
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
    fixture = TestBed.createComponent(SharedCampusEventListComponent);
    component = fixture.componentInstance;
    const dummyProgram: Program = {
      id: 1,
      category_str: '青年教师助课',
      department: '飞海科技',
      name: '不过时候之间国际.',
      category: 4
    };
    component.program = dummyProgram;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load event by admin', () => {
    component.eventListType = EventListType.ADMIN;
    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });

  it('should load event by user', () => {
    component.eventListType = EventListType.USER;


    expect(component.getResults(0, 0)).toBe(getCampusEvents$);
  });

  it('should navigate to program detail', () => {
    component.navigateToProgramDetail();

    expect(navigate).toHaveBeenCalledWith(
      ['../../programs', component.program.id], { relativeTo: route });
  });

  it('should navigate to create form', () => {
    component.navigateToCreateForm();

    expect(navigate).toHaveBeenCalledWith(
      ['./form'], { queryParams: { program_id: component.program.id} , relativeTo: route });
  });
});
