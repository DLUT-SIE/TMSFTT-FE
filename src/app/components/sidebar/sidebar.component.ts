import { Component, OnInit, Inject } from '@angular/core';
import { PlatformService } from 'src/app/services/platform.service';
import { RouteInfo } from 'src/app/interfaces/route-info';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';

export const ADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/demo/user-profile', title: 'Demo-User Profile', icon: 'person', class: '' },
    { path: '/admin/demo/table-list', title: 'Demo-Table List', icon: 'content_paste', class: '' },
    { path: '/admin/demo/typography', title: 'Demo-Typography', icon: 'library_books', class: '' },
    { path: '/admin/demo/icons', title: 'Demo-Icons', icon: 'bubble_chart', class: '' },
    { path: '/admin/demo/notifications', title: 'Demo-Notifications', icon: 'notifications', class: '' },
];

export const REGULAR_USER_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/dashboard', title: '首页', icon: 'dashboard', class: '' },
    { path: '/training-record/entry', title: '培训记录填报', icon: 'create', class: '' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    adminRouteItems = ADMIN_ROUTE_ITEMS;
    regularUserRouteItems = REGULAR_USER_ROUTE_ITEMS;

    constructor(
        readonly platformService: PlatformService,
        readonly notificationService: NotificationService,
        @Inject(AUTH_SERVICE) readonly authService: AuthService,
    ) { }

    ngOnInit() {
    }
}
