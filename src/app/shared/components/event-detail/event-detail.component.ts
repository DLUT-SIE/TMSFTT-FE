import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// import { CampusEvent } from 'src/app/shared/interfaces/event';
import { DomSanitizer } from '@angular/platform-browser';
import { EventDetailType } from '../../enums/event-detaile-type.enum';
import { Program } from '../../interfaces/program';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  checkEventDetailType = EventDetailType;
  @Input() eventDetailType?: EventDetailType;
  @Input() event: {
    id?: number,
    overdue_status?: boolean,
    enrollments_status?: boolean,
    create_time?: string,
    update_time?: string,
    name?: string,
    time?: string,
    location?: string,
    num_hours?: number,
    num_participants?: number,
    deadline?: string,
    num_enrolled?: number,
    description?: string,
    program?: Program
  };

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    readonly location: Location,
  ) { }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/events/form'], { queryParams: { event_id: this.event.id } });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.event.description || /* istanbul ignore next */ '');
  }

}
