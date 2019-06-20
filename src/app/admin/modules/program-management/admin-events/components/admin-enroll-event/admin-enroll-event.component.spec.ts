import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEnrollEventComponent } from './admin-enroll-event.component';

describe('AdminEnrollEventComponent', () => {
  let component: AdminEnrollEventComponent;
  let fixture: ComponentFixture<AdminEnrollEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEnrollEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnrollEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
