import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../environments/environment';
import { PlatformService } from './platform.service';
import { WindowService } from './window.service';
import { LocalStorageService } from './storage/local-storage.service';
import { HTTPAuthService } from './auth/http-auth.service';
import { LocalAuthService } from './auth/local-auth.service';
import { STORAGE_SERVICE } from './storage/storage-service';
import { AUTH_SERVICE } from './auth/auth-service';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule
  ],
  providers: [
    PlatformService,
    WindowService,
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: environment.production ? HTTPAuthService : LocalAuthService,
    }
  ]
})
export class ServicesModule { }
