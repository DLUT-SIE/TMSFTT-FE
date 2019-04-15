import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDetailComponent } from './department-detail.component';
import { MatProgressSpinnerModule, MatCheckboxModule, MatDividerModule } from '@angular/material';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { Subject } from 'rxjs';

describe('DepartmentDetailComponent', () => {
  let component: DepartmentDetailComponent;
  let fixture: ComponentFixture<DepartmentDetailComponent>;
  let getDepartment: jasmine.Spy;
  let getDepartment$: Subject<{}>;

  beforeEach(async(() => {
    getDepartment$ = new Subject();
    getDepartment = jasmine.createSpy().and.returnValue(getDepartment$);
    TestBed.configureTestingModule({
      declarations: [DepartmentDetailComponent],
      imports: [
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatDividerModule,
      ],
      providers: [
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: DepartmentService,
          useValue: {
            getDepartment,
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
