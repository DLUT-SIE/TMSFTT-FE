import { NgModule, LOCALE_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationModule } from './modules/notification/notification.module';
import { ComponentsModule } from './components/components.module';
import { HTTPAuthService } from './services/auth/http-auth.service';
import { STORAGE_SERVICE } from './interfaces/storage-service';
import { LocalStorageService } from './services/storage/local-storage.service';
import { AUTH_SERVICE } from './interfaces/auth-service';
import { PlatformService } from './services/platform.service';
import { WindowService } from './services/window.service';
import { MatPaginatorIntlService } from './services/mat-paginator-intl.service';
import { NotificationService } from './modules/notification/services/notification.service';
import { PermissionService } from './services/auth/permission.service';
import { UserService } from './services/auth/user.service';

import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { MatFormFieldModule, MatInputModule, MatPaginatorIntl } from '@angular/material';

registerLocaleData(localeZhHans, 'zh-Hans');

/** How do we get our JWT. */
export function tokenGetter() {
  return localStorage.getItem(environment.JWT_KEY);
}

/** Describe how our app looks. */
@NgModule({
  declarations: [
    AppComponent,

    // Demo components
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    NotificationsComponent,
    UpgradeComponent,
  ],
  imports: [
    // TODO(youchen): Remove these demo-required dependencies
    // Begin demo-required dependencies
    MatInputModule,
    MatFormFieldModule,
    // End demo-required dependencies
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: environment.WHITE_LIST_DOMAINS,
      }
    }),

    ComponentsModule,
    NotificationModule,
    AppRoutingModule,
  ],
  providers: [
    // Angular related
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlService,
    },
    {
      provide: LOCALE_ID,
      useValue: 'zh-Hans'
    },
    {
      provide: DOCUMENT,
      useValue: document,
    },
    // App related
    PlatformService,
    WindowService,
    NotificationService,
    PermissionService,
    UserService,
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: HTTPAuthService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
