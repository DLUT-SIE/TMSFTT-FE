import { NgModule, LOCALE_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';

import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { TrainingRecordModule } from './modules/training-record/training-record.module';
import { ServicesModule } from './services/services.module';
import { NotificationModule } from './modules/notification/notification.module';


registerLocaleData(localeZhHans, 'zh-Hans');


/** Describe how our app looks. */
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    LoginComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(environment.JWT_KEY),
        whitelistedDomains: environment.WHITE_LIST_DOMAINS,
      }
    }),
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,

    TrainingRecordModule,
    NotificationModule,
    ServicesModule,
    AppRoutingModule,
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'zh-Hans' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
