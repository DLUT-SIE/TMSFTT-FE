import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';


@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent implements OnInit {

  item: CampusEvent;

  constructor(
    readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { item: CampusEvent}) => {
      this.item = data.item;
    });
  }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/event-management/programs/events/event-form']);
  }

}
