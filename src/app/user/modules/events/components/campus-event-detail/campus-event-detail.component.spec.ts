import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { CampusEventDetailComponent } from './campus-event-detail.component';
import { AppEventDetailStub } from 'src/testing/app-event-detail-stub';

describe('CampusEventDetailComponent', () => {
  let component: CampusEventDetailComponent;
  let fixture: ComponentFixture<CampusEventDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CampusEventDetailComponent,
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
    fixture = TestBed.createComponent(CampusEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
