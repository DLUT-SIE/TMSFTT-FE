import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { EventsComponent } from './events.component';
import { CampusEventDetailResolverService } from 'src/app/shared/services/events/campus-event-detail-resolver.service';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';

const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent,
    children: [
      {
        path: ':event_id',
        resolve: {
          event: CampusEventDetailResolverService,
        },
        component: CampusEventDetailComponent,
      },
      {
        path: '',
        component: CampusEventListComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
