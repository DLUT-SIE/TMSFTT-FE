import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CampusEventResponse } from 'src/app/shared/interfaces/event';


@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent implements OnInit {

  item: CampusEventResponse;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { item: CampusEventResponse}) => {
      this.item = data.item;
    });
  }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/event-management/programs/events/event-form']);
  }
  
  
}
