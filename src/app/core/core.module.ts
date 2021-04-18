import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { NotificationDetailComponent } from './notification-detail/notification-detail.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationComponent } from './notification/notification.component';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { IEWarningDialogComponent } from './iewarning-dialog/iewarning-dialog.component';
import { IdleWarningDialogComponent } from './idlewarning-dialog/idlewarning-dialog.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    PageNotFoundComponent,
    PermissionDeniedComponent,
    NotificationDetailComponent,
    NotificationListComponent,
    NotificationComponent,
    ThemePickerComponent,
    IEWarningDialogComponent,
    IdleWarningDialogComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    PageNotFoundComponent,
    PermissionDeniedComponent,
    NotificationDetailComponent,
    NotificationListComponent,
    NotificationComponent,
  ],
  entryComponents: [
    IEWarningDialogComponent,
    IdleWarningDialogComponent,
  ]
})
export class CoreModule { }
