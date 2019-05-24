import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import {
    SUPERADMIN_ROUTE_ITEMS,
    DEPARTMENT_ADMIN_ROUTE_ITEMS,
    REGULAR_USER_ROUTE_ITEMS,
} from '../sidebar/sidebar.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { WindowService } from 'src/app/shared/services/window.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css', './navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    superAdminRouteItems = SUPERADMIN_ROUTE_ITEMS;
    departmentAdminRouteItems = DEPARTMENT_ADMIN_ROUTE_ITEMS;
    regularUserRouteItems = REGULAR_USER_ROUTE_ITEMS;

    private shadingLayer: HTMLDivElement = null;

    @ViewChild('navbarToggler') navBarToggler: ElementRef<HTMLElement>;

    /** Indicate whether the side bar is visible. */
    get navbarToggled() {
        return this.navBarToggler.nativeElement.classList.contains('toggled');
    }

    constructor(
        readonly notificationService: NotificationService,
        @Inject(AUTH_SERVICE) readonly authService: AuthService,
        private readonly location: Location,
        private readonly router: Router,
        private readonly windowService: WindowService,
        @Inject(DOCUMENT) private readonly document: Document,
    ) { }

    ngOnInit() {
       this.router.events.subscribe((event) => {
            this.closeNavbar();
        });
    }

    /** Open navbar. (Available on mobile platform) */
    openNavbar() {
        if (this.navbarToggled === true) return;
        this.navBarToggler.nativeElement.classList.add('toggled');
        this.document.body.classList.add('nav-open');
        this.createShadingLayer();
    }

    closeNavbar() {
        if (this.navbarToggled === false) return;
        this.navBarToggler.nativeElement.classList.remove('toggled');
        this.document.body.classList.remove('nav-open');
        this.shadingLayer.classList.remove('visible');
        timer(400).subscribe(() => {
            this.shadingLayer.remove();
            this.shadingLayer = null;
            this.navBarToggler.nativeElement.classList.remove('toggled');
        });
    }

    private createShadingLayer() {
        this.shadingLayer = this.document.createElement('div');
        this.shadingLayer.setAttribute('class', 'close-layer');
        this.shadingLayer.onclick = this.closeNavbar.bind(this);
        const container = this.document.getElementsByClassName('main-panel')[0];
        container.appendChild(this.shadingLayer);

        timer(100).subscribe(() => {
            this.shadingLayer.classList.add('visible');
        });
    }

    /** Display title for current activated route. */
    getTitle() {
        let url = this.location.prepareExternalUrl(this.location.path());
        // TODO(youchen): Verify intention of below code.
        if (url.charAt(0) === '#') {
            url = url.slice(2);
        }

        for (const item of this.regularUserRouteItems.concat(this.departmentAdminRouteItems).concat(this.superAdminRouteItems)) {
            if (item.path === url || url.startsWith(item.path)) {
                return item.title;
            }
            if (item.otherMatches) {
                for (const itemUrl of item.otherMatches) {
                    if (url.startsWith(itemUrl)) {
                        return item.title;
                    }
                }
            }
        }

        return '教师培训管理系统';
    }

    /** Logout user and redirect to home page. */
    logOut() {
        this.authService.logout();
        this.windowService.redirect('/');
    }
}
