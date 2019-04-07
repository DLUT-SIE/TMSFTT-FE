import { NgModule, LOCALE_ID } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { registerLocaleData, DOCUMENT } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';
import { MatPaginatorIntl } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MatPaginatorIntlService } from './shared/services/mat-paginator-intl.service';
import { STORAGE_SERVICE } from './shared/interfaces/storage-service';
import { LocalStorageService } from './shared/services/local-storage.service';
import { AUTH_SERVICE } from './shared/interfaces/auth-service';
import { HTTPAuthService } from './shared/services/http-auth.service';
import { SharedModule } from './shared/shared.module';

import { TableListComponent } from 'src/app/demo/table-list/table-list.component';
import { UserProfileComponent } from 'src/app/demo/user-profile/user-profile.component';
import { TypographyComponent } from 'src/app/demo/typography/typography.component';
import { IconsComponent } from 'src/app/demo/icons/icons.component';
import { NotificationsComponent } from 'src/app/demo/notifications/notifications.component';
import { UpgradeComponent } from 'src/app/demo/upgrade/upgrade.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    BrowserModule,
    BrowserAnimationsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: environment.WHITE_LIST_DOMAINS,
      }
    }),

    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlService,
    },
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: HTTPAuthService,
    },
    // Angular related
    {
      provide: LOCALE_ID,
      useValue: 'zh-Hans'
    },
    {
      provide: DOCUMENT,
      useValue: document,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
