import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { ProgramDetailResolverService } from './program-detail-resolver.service';
import { ProgramService } from './program.service';

describe('ProgramDetailResolverService', () => {
  let getProgramWithDetail: jasmine.Spy;
  beforeEach(() => {
    getProgramWithDetail = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ProgramService,
          useValue: { getProgramWithDetail }
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
    getProgramWithDetail.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();

    expect(getProgramWithDetail).toHaveBeenCalledWith(id);
  });
});
