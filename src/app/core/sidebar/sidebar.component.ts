import { Component, OnInit, Inject } from '@angular/core';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { RouteInfo } from 'src/app/shared/interfaces/route-info';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RecordService } from 'src/app/shared/services/records/record.service';

export const SUPERADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/permissions', title: '权限管理', icon: 'security', class: '' },
];

export const DEPARTMENT_ADMIN_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/admin/programs', title: '项目管理', icon: 'event', class: '', otherMatches: ['/admin/events']},
    { path: '/admin/data', title: '数据管理', icon: 'data_usage', class: '' },
];

export const REGULAR_USER_ROUTE_ITEMS: RouteInfo[] = [
    { path: '/user/dashboard', title: '首页', icon: 'dashboard', class: '' },
    { path: '/user/events', title: '校内培训活动', icon: 'list', class: '' },
    // TODO(youchen): Display the number of records without feedbacks.
    { path: '/user/records', title: '个人培训记录', icon: 'inbox', class: '' },
    { path: '/user/off-campus-event-records', title: '校外培训填报', icon: 'create', class: '' },
    { path: '/user/statistics', title: '个人数据统计', icon: 'unarchive', class: '' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss', './sidebar.component.css']
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
