import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { Program } from 'src/app/shared/interfaces/program';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { EventDetailType } from '../../enums/event-detaile-type.enum';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() eventDetailType?: EventDetailType;
  item: CampusEvent;
  program: Program;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly programService: ProgramService,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.pipe(
      switchMap(data => {
        this.item = data.item;
        return this.programService.getProgram(this.item.program as number);
      })
    ).subscribe(program => {
      this.program = program;
    });
  }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/events/form'], { queryParams: { event_id: this.item.id } });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.item.description || /* istanbul ignore next */ '');
  }

}
