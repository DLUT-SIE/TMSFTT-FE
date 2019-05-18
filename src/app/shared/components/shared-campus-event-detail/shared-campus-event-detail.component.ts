import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from '../../enums/event-detaile-type.enum';
import { CampusEvent } from '../../interfaces/event';
import { EventService } from '../../services/events/event.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-shared-campus-event-detail',
  templateUrl: './shared-campus-event-detail.component.html',
  styleUrls: ['./shared-campus-event-detail.component.css']
})
export class SharedCampusEventDetailComponent {
  checkEventDetailType = EventDetailType;
  @Input() eventDetailType?: EventDetailType;
  @Input() event?: CampusEvent;

  constructor(
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

  deleteEnrollment(id: number) {
    this.eventService.deleteEventEnrollment(id).subscribe(() => {
      this.snackBar.open('取消报名成功', '关闭');
      this.router.navigate(['/user/events/']);
    });
  }
}
