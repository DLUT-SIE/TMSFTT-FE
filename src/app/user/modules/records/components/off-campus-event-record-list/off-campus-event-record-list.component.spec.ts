import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule, MatPaginatorModule, MatIconModule } from '@angular/material';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { OffCampusEventRecordListComponent } from './off-campus-event-record-list.component';
import { SharedRecordListComponent } from 'src/app/shared/components/shared-record-list/shared-record-list.component';

describe('OffCampusEventRecordListComponent', () => {
  let component: OffCampusEventRecordListComponent;
  let fixture: ComponentFixture<OffCampusEventRecordListComponent>;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    navigate = jasmine.createSpy();
    TestBed.configureTestingModule({
      declarations: [
        OffCampusEventRecordListComponent,
        SharedRecordListComponent,
      ],
      imports: [
        MatIconModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate,
          }
        },
        {
          provide: Location,
          useValue: {},
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffCampusEventRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to form', () => {
    component.navigateToForm();

    expect(navigate).toHaveBeenCalled();
  });

});
