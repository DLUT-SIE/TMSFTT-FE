import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from 'src/app/shared/enums/event-detail-type.enum';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/events/event.service';
import { MatSnackBar } from '@angular/material';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';
import { WindowService } from 'src/app/shared/services/window.service';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-shared-campus-event-detail',
  templateUrl: './shared-campus-event-detail.component.html',
  styleUrls: ['./shared-campus-event-detail.component.css']
})
export class SharedCampusEventDetailComponent {
  EventDetailType = EventDetailType;
  @Input() eventDetailType: EventDetailType;
  @Input() event: CampusEvent;

  constructor(
    @Inject(AUTH_SERVICE) readonly authService: AuthService,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly eventService: EventService,
    protected readonly snackBar: MatSnackBar,
    readonly location: Location,
    private readonly windowService: WindowService,
    private readonly loggerService: LoggerService,
  ) { }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/events/form'], { queryParams: { event_id: this.event.id } });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.event.description || /* istanbul ignore next */ '');
  }

  deleteEnrollment() {
    this.eventService.deleteEventEnrollment(this.event.enrollment_id).subscribe(() => {
      this.snackBar.open('取消报名成功', '关闭');
      this.router.navigate(['/user/events/']);
    });
  }

  reviewCampusEvent() {
    this.eventService.reviewCampusEvent(this.event).subscribe(
      () => {
        this.snackBar.open('已审核通过该培训活动', '关闭', {duration: 3000});
        this.event.reviewed = true;
      },
      () => {
        this.snackBar.open('审核失败，请尝试重新审核', '关闭', {duration: 3000});
      }
    );
  }

  buildUrl(eventId: number): string {
    return  `/aggregate-data/table-export/?table_type=9&event_id=${eventId}`;
  }

  doResultsExport(eventId: number) {
    this.eventService.exportAttendanceSheet(this.buildUrl(eventId)).subscribe(
      data => {
          this.windowService.open(data['url']);
          this.snackBar.open('导出成功', '确定', {duration: 3000});
      },
      (error: HttpErrorResponse) => {
          this.loggerService.log(error);
          let message = error.message;
          if (error.error) {
            message = '';
            for (const key of Object.keys(error.error)) {
              message += error.error[key].join(',');
            }
          }
          this.snackBar.open(message, '关闭');
      });
  }
}
