import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { CampusEventDetailResolverService } from './campus-event-detail-resolver.service';
import { EventService } from './event.service';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { Program } from 'src/app/shared/interfaces/program';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Subject } from 'rxjs';

describe('CampusEventDetailResolverService', () => {
  let getEvent: jasmine.Spy;
  let getEvent$: Subject<CampusEvent>;
  let getProgram: jasmine.Spy;
  let getProgram$: Subject<Program>;

  beforeEach(() => {
    getEvent = jasmine.createSpy();
    getProgram$ = new Subject<Program>();
    getProgram = jasmine.createSpy();
    getProgram.and.returnValue(getProgram$);

    getEvent$ = new Subject<CampusEvent>();
    getEvent.and.returnValue(getEvent$);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: EventService,
          useValue: { getEvent }
        },
        {
          provide: ProgramService,
          useValue: { getProgram }
        }
      ]
    });
  });
  it('should be created', () => {
    const service: CampusEventDetailResolverService = TestBed.get(CampusEventDetailResolverService);
    expect(service).toBeTruthy();
  });
  it('should resolve data', () => {
    const service: CampusEventDetailResolverService = TestBed.get(CampusEventDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    const event = {
      id: 601,
      program: {
        id: 1,
        category_str: '青年教师助课',
        department: '飞海科技',
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
    };
    getEvent.and.returnValue(observableOf(event));
    const program =  {
      id: 1,
      category_str: '青年教师助课',
      department: '飞海科技',
      name: '不过时候之间国际.',
      category: 4
    };
    getProgram.and.returnValue(observableOf(program));
    service.resolve(route, null).subscribe();
    expect(getEvent).toHaveBeenCalledWith(id);
  });
});
