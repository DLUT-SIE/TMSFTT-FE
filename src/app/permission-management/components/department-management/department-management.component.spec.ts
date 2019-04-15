import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentManagementComponent } from './department-management.component';
import { MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Location } from '@angular/common';
import { DepartmentService } from 'src/app/shared/services/department.service';

describe('DepartmentManagementComponent', () => {
  let component: DepartmentManagementComponent;
  let fixture: ComponentFixture<DepartmentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentManagementComponent ],
      imports: [
        MatPaginatorModule,
        MatProgressSpinnerModule,
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
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: Location,
          useValue: {},
        },
        {
          provide: DepartmentService,
          useValue: {},
        },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
