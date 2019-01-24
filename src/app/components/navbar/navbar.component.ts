import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

import { RouteInfo } from 'src/app/interfaces/route-info';
import { ROUTES } from 'src/app/components/sidebar/sidebar.component';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: RouteInfo[];

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
        @Inject(DOCUMENT) private readonly document: Document,
    ) { }

    ngOnInit() {
        this.listTitles = ROUTES;
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
        if (url.charAt(0) === '#') {
            url = url.slice(2);
        }

        for (const item of this.listTitles) {
            if (item.path === url) {
                return item.title;
            }
        }

        return 'TMSFTT';
    }
}
