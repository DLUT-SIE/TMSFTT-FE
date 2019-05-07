import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { ProgramDetailResolverService } from './program-detail-resolver.service';
import { ProgramService } from './program.service';

describe('ProgramDetailResolverService', () => {
  let getProgram: jasmine.Spy;
  beforeEach(() => {
    getProgram = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProgramService,
          useValue: { getProgram }
        }
      ]
    });
  });

  it('should be created', () => {
    const service: ProgramDetailResolverService = TestBed.get(ProgramDetailResolverService);
    expect(service).toBeTruthy();
  });

  it('should resolve data', () => {
    const service: ProgramDetailResolverService = TestBed.get(ProgramDetailResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getProgram.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();
  });
});
