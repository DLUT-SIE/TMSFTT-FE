import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { EventDetailType } from '../../enums/event-detaile-type.enum';

describe('AddminCampusEventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let navigate: jasmine.Spy;
  let bypassSecurityTrustHtml: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    bypassSecurityTrustHtml = jasmine.createSpy().and.returnValue('abc');
    TestBed.configureTestingModule({
      declarations: [
        EventDetailComponent
      ],
      providers: [
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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
    const event =  {
      id: 12,
      overdue_status: true,
      enrollments_status: true,
      create_time: '2019-05-09T10:39:41.793039+08:0',
      update_time: '2019-05-10T09:10:48.370559+08:00',
      name: '1243124',
      time: '2020-05-01T00:24:00+08:00',
      location: '1233',
      num_hours: 312.0,
      num_participants: 123,
      deadline: '2020-02-01T03:23:00+08:00',
      num_enrolled: 123,
      description: '<p class="abc">abc</p>',
      program: {
        id: 1,
        category_str: '青年教师助课',
        department: '飞海科技',
        name: '不过时候之间国际.',
        category: 4
      }
    };
    component.event = event;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to event form by admin', () => {
    component.eventDetailType = EventDetailType.ADMIN;
    component.navigateToChangeEvent();

    expect(navigate).toHaveBeenCalled();
  });

  it('should bypass sanitizing.', () => {
    const description = '<p class="abc">abc</p>';
    component.event.description = description;
    bypassSecurityTrustHtml.and.returnValue(description);

    expect(component.event.description).toBe(description);

    expect(bypassSecurityTrustHtml).toHaveBeenCalledWith(description);
  });
});
