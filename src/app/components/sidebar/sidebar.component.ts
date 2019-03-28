import { Component, OnInit, Inject } from '@angular/core';
import { PlatformService } from 'src/app/services/platform.service';
import { RouteInfo } from 'src/app/interfaces/route-info';
import { AUTH_SERVICE, AuthService } from 'src/app/interfaces/auth-service';
import { NotificationService } from 'src/app/modules/notification/services/notification.service';

export const ADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/event-management', title: '项目管理', icon: 'event', class: '' },
    { path: '/admin/data-management', title: '数据管理', icon: 'data_usage', class: '' },
    { path: '/admin/permission-management', title: '权限管理', icon: 'security', class: '' },

    { path: '/demo/user-profile', title: 'Demo-User Profile', icon: 'person', class: '' },
    { path: '/demo/table-list', title: 'Demo-Table List', icon: 'content_paste', class: '' },
    { path: '/demo/typography', title: 'Demo-Typography', icon: 'library_books', class: '' },
    { path: '/demo/icons', title: 'Demo-Icons', icon: 'bubble_chart', class: '' },
    { path: '/demo/notifications', title: 'Demo-Notifications', icon: 'notifications', class: '' },
];

export const REGULAR_USER_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/dashboard', title: '首页', icon: 'dashboard', class: '' },
    { path: '/training-event/events', title: '校内培训活动', icon: 'list', class: '' },
    // TODO(youchen): Display the number of records without feedbacks.
    { path: '/training-record/records', title: '个人培训记录', icon: 'how_to_reg', class: '' },
    { path: '/training-record/entry', title: '校外培训填报', icon: 'create', class: '' },
    { path: '/personal-summary', title: '个人数据统计', icon: 'unarchive', class: '' },
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
