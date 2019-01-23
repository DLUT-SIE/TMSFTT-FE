import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatProgressBarModule,
  MatIconModule,
  MatBadgeModule,
  MatDialogModule,
} from '@angular/material';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    HttpClientModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    PageNotFoundComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    PageNotFoundComponent,
  ]
})
export class ComponentsModule { }
