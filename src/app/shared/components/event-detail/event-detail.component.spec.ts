import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { EventDetailComponent } from './event-detail.component';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { Subject } from 'rxjs';
import { Program } from 'src/app/shared/interfaces/program';
import { EventDetailType } from '../../enums/event-detaile-type.enum';

describe('AddminCampusEventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let navigate: jasmine.Spy;
  let bypassSecurityTrustHtml: jasmine.Spy;
  let getProgram$: Subject<Program>;
  let getProgram: jasmine.Spy;

  const dummyProgram: Program = {
    id: 1,
    name: 'sender',
    department: 'department',
    category: 3,
    category_str: 'category_str',
    form: [],
  };

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    bypassSecurityTrustHtml = jasmine.createSpy().and.returnValue('abc');
    getProgram$ = new Subject<Program>();
    getProgram = jasmine.createSpy();
    getProgram.and.returnValue(getProgram$);
    TestBed.configureTestingModule({
      declarations: [
        EventDetailComponent
      ],
      providers: [
        {
          provide: ProgramService,
          useValue: {
            getProgram,
          }
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml,
            sanitize: () => 'abc',
          },
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            createUrlTree: () => 'abc',
            navigate,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
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
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load program by admin', () => {
    component.eventDetailType = EventDetailType.ADMIN;
    getProgram$.next(dummyProgram);
    expect(component.program).toEqual(dummyProgram);
  });

  it('should load program by user', () => {
    component.eventDetailType = EventDetailType.USER;
    getProgram$.next(dummyProgram);
    expect(component.program).toEqual(dummyProgram);
  });

  it('should navigate to event form by admin', () => {
    component.eventDetailType = EventDetailType.ADMIN;
    component.navigateToChangeEvent();

    expect(navigate).toHaveBeenCalled();
  });

  it('should bypass sanitizing.', () => {
    const description = '<p class="abc">abc</p>';
    component.item.description = description;
    bypassSecurityTrustHtml.and.returnValue(description);

    expect(component.description).toBe(description);
    expect(bypassSecurityTrustHtml).toHaveBeenCalledWith(description);
  });
});
