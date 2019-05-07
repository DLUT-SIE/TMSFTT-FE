import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AdminCampusEventDetailComponent } from './admin-campus-event-detail.component';
import { AppEventDetailStub } from 'src/testing/app-event-detail-stub';

describe('AddminCampusEventDetailComponent', () => {
  let component: AdminCampusEventDetailComponent;
  let fixture: ComponentFixture<AdminCampusEventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminCampusEventDetailComponent,
        AppEventDetailStub
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampusEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
