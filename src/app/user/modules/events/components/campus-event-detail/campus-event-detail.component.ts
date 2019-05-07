import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent implements OnInit {

  item: CampusEvent;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    readonly location: Location,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { item: CampusEvent}) => {
      this.item = data.item;
    });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.item.description || /* istanbul ignore next */ '');
  }

}
