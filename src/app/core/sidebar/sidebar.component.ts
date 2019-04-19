import { Component, OnInit, Inject } from '@angular/core';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { RouteInfo } from 'src/app/shared/interfaces/route-info';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RecordService } from 'src/app/training-record/services/record.service';

export const SUPERADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/permission-management', title: '权限管理', icon: 'security', class: '' },
    // { path: '/demo/user-profile', title: 'Demo-User Profile', icon: 'person', class: '' },
    // { path: '/demo/table-list', title: 'Demo-Table List', icon: 'content_paste', class: '' },
    // { path: '/demo/typography', title: 'Demo-Typography', icon: 'library_books', class: '' },
    // { path: '/demo/icons', title: 'Demo-Icons', icon: 'bubble_chart', class: '' },
    // { path: '/demo/notifications', title: 'Demo-Notifications', icon: 'notifications', class: '' },
];

export const DEPARTMENT_ADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/event-management/programs', title: '项目管理', icon: 'event', class: '' },
    { path: '/admin/data-management', title: '数据管理', icon: 'data_usage', class: '' },
];

export const REGULAR_USER_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/dashboard', title: '首页', icon: 'dashboard', class: '' },
    { path: '/training-event/events', title: '校内培训活动', icon: 'list', class: '' },
    // TODO(youchen): Display the number of records without feedbacks.
    { path: '/training-record/records', title: '个人培训记录', icon: 'how_to_reg', class: '' },
    { path: '/training-record/off-campus-event-records', title: '校外培训填报', icon: 'create', class: '' },
    { path: '/statistics', title: '个人数据统计', icon: 'unarchive', class: '' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    superAdminRouteItems = SUPERADMIN_ROUTE_ITEMS;
    departmentAdminRouteItems = DEPARTMENT_ADMIN_ROUTE_ITEMS;
    regularUserRouteItems = REGULAR_USER_ROUTE_ITEMS;

    constructor(
        readonly platformService: PlatformService,
        readonly recordService: RecordService,
        readonly notificationService: NotificationService,
        @Inject(AUTH_SERVICE) readonly authService: AuthService,
    ) { }

    ngOnInit() {
    }
}
