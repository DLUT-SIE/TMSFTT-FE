import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Location, PopStateEvent, DOCUMENT } from '@angular/common';
import { NavigationEnd, NavigationStart, Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import PerfectScrollbar from 'perfect-scrollbar';

import { PlatformService } from './shared/services/platform.service';
import { PlatformType } from './shared/enums/platform-type.enum';
import { WindowService } from './shared/services/window.service';
import { StyleManager } from './shared/services/style-manager.service';
import { SiteTheme } from './shared/interfaces/theme';
import { SwUpdate } from '@angular/service-worker';
import { detectIE } from 'src/app/shared/utils/detect-ie';
import { MatDialog } from '@angular/material';
import { IEWarningDialogComponent } from './core/iewarning-dialog/iewarning-dialog.component';

/** Root component. */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('themeContainer') themeContainer: ElementRef;
  /** Record the last popped url. */
  private lastPoppedUrl: string;
  /** Record the y-axis state for all routes */
  private yScrollStack: number[] = [];
  private asyncLoadingCount = 0;

  constructor(
    readonly styleManager: StyleManager,
    private readonly location: Location,
    private readonly platformService: PlatformService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly windowService: WindowService,
    private readonly updates: SwUpdate,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.updates.available.subscribe(event => {
      if (confirm('检测到您正在使用过期的页面，点击确定以更新至最新版本')) {
        /* istanbul ignore next */
        this.updates.activateUpdate().then(() => this.document.location.reload());
      }
    });
    if (detectIE() !== false) {
      this.dialog.open(IEWarningDialogComponent, {
        width: this.platformService.isMobile ? '100%' : undefined,
      });
    }
  }

  ngOnInit() {
    this.styleManager.themeChanged.subscribe((theme: SiteTheme) => {
      (this.themeContainer.nativeElement as HTMLElement).classList.value = theme.name;
    });

    if (this.platformService.platformType === PlatformType.WINDOWS
      && !this.document.body.classList.contains('sidebar-mini')) {
      // if we are on windows OS we activate the perfectScrollbar function
      this.document.body.classList.add('perfect-scrollbar-on');
    }

    this.location.subscribe((event: PopStateEvent) => {
      this.lastPoppedUrl = event.url;
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        /** Before we navigate to other route, we record the current y-axis position. */
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(this.windowService.nativeWindow.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        /**
         * After we navigated, if this is a go-back navigation, we scroll to
         * its last position.
         */
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = null;
          this.windowService.nativeWindow.scrollTo(0, this.yScrollStack.pop());
        } else {
          this.windowService.nativeWindow.scrollTo(0, 0);
        }
      } else if (event instanceof RouteConfigLoadStart) {
        this.asyncLoadingCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.asyncLoadingCount--;
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        /** Reset positions of main-panel and sidebar. */
        const elemMainPanel = this.document.querySelector('.main-panel') as HTMLElement;
        const elemSidebar = this.document.querySelector('.sidebar .sidebar-wrapper') as HTMLElement;
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });

  }

  ngAfterViewInit() {
    if (this.platformService.platformType === PlatformType.WINDOWS
      && this.windowService.nativeWindow.matchMedia('(min-width: 960px)').matches) {
      const elemMainPanel = document.querySelector('.main-panel') as HTMLElement;
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }

  get isLoading() {
    return this.asyncLoadingCount !== 0;
  }
}
