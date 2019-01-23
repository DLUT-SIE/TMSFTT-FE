import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { PlatformService } from './platform.service';
import { PlatformType } from '../enums/platform-type.enum';

describe('PlatformService', () => {
  const navigator = {
    platform: '',
  };
  const stateObservable = new Subject<BreakpointState>();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => stateObservable },
        },
        {
          provide: Navigator,
          useValue: navigator,
        },
      ],
    });
  });

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

  it('should set platformType to WINDOWS if it\'s on Windows', () => {
    navigator.platform = 'Windows';
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.WINDOWS);
  });

  it('should set platformType to Mac if it\'s on Mac', () => {
    navigator.platform = 'Mac OS';
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.MAC);
  });

  it('should set platformType to OTHERS if it\'s on unknown platform', () => {
    navigator.platform = 'Unknown platform';
    const service: PlatformService = TestBed.get(PlatformService);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.OTHERS);
  });
});
