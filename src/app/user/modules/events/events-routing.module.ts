import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampusEventListComponent } from './components/campus-event-list/campus-event-list.component';
import { EventsComponent } from './events.component';
import { EventDetailResolverService } from 'src/app/shared/services/events/event-detail-resolver.service';
import { CampusEventDetailComponent } from './components/campus-event-detail/campus-event-detail.component';

const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent,
    children: [
      {
        path: ':id',
        resolve: {
          item: EventDetailResolverService,
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
