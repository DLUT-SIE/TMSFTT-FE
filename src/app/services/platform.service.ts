import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { PlatformType } from '../enums/platform-type.enum';


/** PlatformService provides platform-specific services. */
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  /** Indicate whether we are rendering on mobile platform. */
  isMobile = false;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
  ) {
    // This should react during the whole lifetime, so we don't need to
    // unsubscribe the subscription.
    this.breakpointObserver.observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      });

  }

  get nativeNavigator() {
    return navigator;
  }

  get platformType() {
    if (this.nativeNavigator.platform.indexOf('Win') > -1) {
      return PlatformType.WINDOWS;
    } else if (this.nativeNavigator.platform.toUpperCase().indexOf('MAC') > -1) {
      return PlatformType.MAC;
    }
    return PlatformType.OTHERS;
  }
}
