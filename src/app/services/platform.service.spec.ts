import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { PlatformService } from './platform.service';
import { PlatformType } from '../enums/platform-type.enum';

describe('PlatformService', () => {
  const stateObservable = new Subject<BreakpointState>();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => stateObservable },
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
    const service: PlatformService = TestBed.get(PlatformService);
    const navigator = {
      platform: 'Windows',
    };
    spyOnProperty(service, 'nativeNavigator', 'get').and.returnValue(navigator);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.WINDOWS);
  });

  it('should set platformType to Mac if it\'s on Mac', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    const navigator = {
      platform: 'MAC OS',
    };
    spyOnProperty(service, 'nativeNavigator', 'get').and.returnValue(navigator);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.MAC);
  });

  it('should set platformType to OTHERS if it\'s on unknown platform', () => {
    const service: PlatformService = TestBed.get(PlatformService);
    const navigator = {
      platform: 'Other Platform',
    };
    spyOnProperty(service, 'nativeNavigator', 'get').and.returnValue(navigator);
    expect(service).toBeTruthy();
    expect(service.platformType).toEqual(PlatformType.OTHERS);
  });
});
