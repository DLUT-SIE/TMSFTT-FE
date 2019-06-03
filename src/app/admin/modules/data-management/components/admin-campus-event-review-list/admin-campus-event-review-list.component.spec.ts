import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampusEventReviewListComponent } from './admin-campus-event-review-list.component';
import { AppSharedCampusEventListStub } from 'src/testing/app-shared-campus-event-list-stub';

describe('AdminCampusEventReviewListComponent', () => {
  let component: AdminCampusEventReviewListComponent;
  let fixture: ComponentFixture<AdminCampusEventReviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventReviewListComponent,
        AppSharedCampusEventListStub,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusEventReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
