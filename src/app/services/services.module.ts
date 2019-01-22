import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlatformService } from './platform.service';
import { WindowService } from './window.service';
import { LocalStorageService } from './storage/local-storage.service';
import { HTTPAuthService } from './auth/http-auth.service';
import { STORAGE_SERVICE } from 'src/app/interfaces/storage-service';
import { AUTH_SERVICE } from 'src/app/interfaces/auth-service';
import { RecordService } from './training-record/record.service';
import { RecordAttachmentService } from './training-record/record-attachment.service';
import { RecordContentService } from './training-record/record-content.service';
import { EventService } from './training-event/event.service';
import { NotificationService } from './notification/notification.service';
import { MatPaginatorIntlService } from './mat-paginator-intl.service';
import { NotificationDetailResolverService } from './notification/notification-detail-resolver.service';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule
  ],
  providers: [
    PlatformService,
    WindowService,
    EventService,
    RecordService,
    RecordContentService,
    RecordAttachmentService,
    MatPaginatorIntlService,
    NotificationService,
    NotificationDetailResolverService,
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: HTTPAuthService,
      /** Use below if you want to mock AuthService during development. */
      // useClass: environment.production ? HTTPAuthService : LocalAuthService,
    }
  ]
})
export class ServicesModule { }
