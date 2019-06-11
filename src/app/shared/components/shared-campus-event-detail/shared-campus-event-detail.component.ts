import { Component, Input, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { errorProcess } from '../../utils/error-process';
import { copyToClipboard } from '../../utils/copy-to-clipboard';

@Component({
  selector: 'app-shared-campus-event-detail',
  templateUrl: './shared-campus-event-detail.component.html',
  styleUrls: ['./shared-campus-event-detail.component.css']
})
export class SharedCampusEventDetailComponent implements OnInit {
  EventDetailType = EventDetailType;
  isLoading = false;

  @Input() eventDetailType: EventDetailType;
  @Input() event: CampusEvent;

  constructor(
    @Inject(AUTH_SERVICE) readonly authService: AuthService,
    readonly location: Location,
    protected readonly snackBar: MatSnackBar,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly eventService: EventService,
    private readonly windowService: WindowService,
    private readonly loggerService: LoggerService,
  ) { }

  ngOnInit() {
    const url = this.route.snapshot.url;
    if (this.eventDetailType === EventDetailType.USER && url[url.length - 1].path === 'enroll') {
      this.enrollEvent();
    }
  }

  navigateToChangeEvent() {
    this.router.navigate(['../form'], { queryParams: { program_id: this.event.program, event_id: this.event.id }, relativeTo: this.route });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.event.description || /* istanbul ignore next */ '');
  }

  deleteEnrollment() {
    this.isLoading = true;
    this.eventService.deleteEventEnrollment(this.event.enrollment_id).subscribe(
      () => {
        this.snackBar.open('取消报名成功', '关闭');
        this.event.enrolled = false;
        this.event.enrollment_id = null;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭');
        this.isLoading = false;
      },
    );
  }

  reviewCampusEvent() {
    this.eventService.reviewCampusEvent(this.event).subscribe(
      () => {
        this.snackBar.open('已审核通过该培训活动', '关闭', { duration: 3000 });
        this.event.reviewed = true;
      },
      () => {
        this.snackBar.open('审核失败，请尝试重新审核', '关闭', { duration: 3000 });
      }
    );
  }

  buildUrl(eventId: number): string {
    return `/aggregate-data/table-export/?table_type=9&event_id=${eventId}`;
  }

  doResultsExport(eventId: number) {
    this.eventService.exportAttendanceSheet(this.buildUrl(eventId)).subscribe(
      data => {
        this.windowService.open(data['url']);
        this.snackBar.open('导出成功', '确定', { duration: 3000 });
      },
      (error: HttpErrorResponse) => {
        this.loggerService.log(error);
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭', { duration: 3000 });
      });
  }

  enrollEvent() {
    this.isLoading = true;
    this.eventService.enrollCampusEvent(this.event).subscribe(
      (data) => {
        this.snackBar.open('报名成功!', '关闭', {duration: 3000});
        this.event.enrollment_id = data.id;
        this.event.enrolled = true;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        const message = errorProcess(error);
        this.snackBar.open(message, '关闭', {duration: 3000});
        this.isLoading = false;
      });
  }

  copyEnrollLink() {
    const path = this.router.createUrlTree(
      ['user', 'events', this.event.id, 'enroll']
    ).toString();
    const url = `${this.windowService.host}${path}`;
    copyToClipboard(url);
    this.snackBar.open('已将报名链接复制到剪贴板', '关闭', {duration: 3000});
  }
}
