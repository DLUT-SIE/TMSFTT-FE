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
import { AdminComponent } from './modules/roles/admin/admin.component';
import { RegularUserComponent } from './modules/roles/regular-user/regular-user.component';


registerLocaleData(localeZhHans, 'zh-Hans');

/** How do we get our JWT. */
export function tokenGetter() {
  return localStorage.getItem(environment.JWT_KEY);
}

/** Describe how our app looks. */
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    RegularUserComponent,
  ],
  imports: [
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
    MatPaginatorIntlService,
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
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: HTTPAuthService,
      /** Use below if you want to mock AuthService during development. */
      // useClass: environment.production ? HTTPAuthService : LocalAuthService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
