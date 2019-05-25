import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from 'src/app/shared/enums/event-detail-type.enum';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { EventService } from 'src/app/shared/services/events/event.service';
import { MatSnackBar } from '@angular/material';
import { AUTH_SERVICE, AuthService } from 'src/app/shared/interfaces/auth-service';

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
}
