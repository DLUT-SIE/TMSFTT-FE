import { Component, OnInit, Inject } from '@angular/core';
import { PlatformService } from 'src/app/services/platform.service';
import { RouteInfo } from 'src/app/interfaces/route-info';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
    { path: '/training-record/entry', title: 'TrainingRecord', icon: 'create', class: '' },
    { path: '/demo/user-profile', title: 'Demo-User Profile', icon: 'person', class: '' },
    { path: '/demo/table-list', title: 'Demo-Table List', icon: 'content_paste', class: '' },
    { path: '/demo/typography', title: 'Demo-Typography', icon: 'library_books', class: '' },
    { path: '/demo/icons', title: 'Demo-Icons', icon: 'bubble_chart', class: '' },
    { path: '/demo/notifications', title: 'Demo-Notifications', icon: 'notifications', class: '' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: RouteInfo[];

    constructor(
        readonly platformService: PlatformService,
        @Inject(AUTH_SERVICE) readonly authService: AuthService,
    ) { }

    ngOnInit() {
        this.authService.authenticationSucceed.subscribe(() => {
            this.menuItems = ROUTES;
        });
    }
}
