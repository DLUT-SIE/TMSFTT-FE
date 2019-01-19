import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

/** PlatformService provides platform-specific services. */
@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  /** Indicate whether we are rendering on mobile platform. */
  isMobile = false;

  constructor(private breakpointObserver: BreakpointObserver) {
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
}
