<<<<<<< HEAD
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { GroupResolverService } from './group-resolver.service';
import { GroupService } from './group.service';

describe('GroupResolverService', () => {
  let getGroupById: jasmine.Spy;
  beforeEach(() => {
    getGroupById = jasmine.createSpy();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GroupService,
          useValue: { getGroupById }
        }
      ]
    });
  });

  it('should be created', () => {
    const service: GroupResolverService = TestBed.get(GroupResolverService);
    expect(service).toBeTruthy();
  });

  it('should resolve data', () => {
    const service: GroupResolverService = TestBed.get(GroupResolverService);
    const id = 10;
    const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
    route.paramMap = {
      get: (key: string) => id.toString(),
    };
    getGroupById.and.returnValue(observableOf(null));

    service.resolve(route, null).subscribe();

    expect(getGroupById).toHaveBeenCalledWith(id);
  });
});
=======
// import { TestBed } from '@angular/core/testing';
// import { of as observableOf } from 'rxjs';
// import { GroupResolverService } from './group-resolver.service';
// import { GroupService } from './group.service';
//
// describe('GroupResolverService', () => {
//   let getGroup: jasmine.Spy;
//   beforeEach(() => {
//     getGroup = jasmine.createSpy();
//     TestBed.configureTestingModule({
//       providers: [
//         {
//           provide: GroupService,
//           useValue: { getGroup }
//         }
//       ]
//     });
//   });
//
//   it('should be created', () => {
//     const service: GroupResolverService = TestBed.get(GroupResolverService);
//     expect(service).toBeTruthy();
//   });
//
//   it('should resolve data', () => {
//     const service: GroupResolverService = TestBed.get(GroupResolverService);
//     const id = 10;
//     const route = jasmine.createSpyObj('ActivatedRouteSnapshot', ['toString']);
//     route.paramMap = {
//       get: (key: string) => id.toString(),
//     };
//     getGroup.and.returnValue(observableOf(null));
//
//     service.resolve(route, null).subscribe();
//
//     expect(getGroup).toHaveBeenCalledWith(id);
//   });
// });
>>>>>>> CRUD function of userGroup
