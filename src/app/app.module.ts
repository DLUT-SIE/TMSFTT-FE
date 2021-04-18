import { NgModule, LOCALE_ID, Injector } from '@angular/core';
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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIHostInterceptor } from './core/api-host-interceptor/apihost-interceptor.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';

registerLocaleData(localeZhHans, 'zh-Hans');

/** How do we get JWT. */
export function tokenGetter() {
  return localStorage.getItem(environment.JWT_KEY);
}

/* tslint:disable-next-line:variable-name */
export let AppInjector: Injector;

/** Describe how our app looks. */
@NgModule({
  declarations: [
    AppComponent,
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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIHostInterceptor,
      multi: true,
    },
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
 }
