import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  const stateObservable = new Subject<BreakpointState>();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: BreakpointObserver,
        useValue: { observe: () => stateObservable },
      }
    ],
  }));

  it('should be created', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
  });

  it('should set isMobile to true if on mobile platform', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
    stateObservable.next({ matches: true } as BreakpointState);
    expect(service.isMobile).toBeTruthy();
  });

  it('should set isMobile to false if on desktop platform', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
    stateObservable.next({ matches: false } as BreakpointState);
    expect(service.isMobile).toBeFalsy();
  });
});
