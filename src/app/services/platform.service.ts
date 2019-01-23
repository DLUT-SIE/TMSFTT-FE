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
  platformType: PlatformType = PlatformType.OTHERS;

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly navigator: Navigator,
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

      if (this.navigator.platform.indexOf('Win') > -1) {
        this.platformType = PlatformType.WINDOWS;
      } else if (this.navigator.platform.toUpperCase().indexOf('MAC') > -1) {
        this.platformType = PlatformType.MAC;
      }
  }
}
