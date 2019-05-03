import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentGroupPermissionComponent } from './department-group-permission.component';

describe('DepartmentGroupPermissionComponent', () => {
  let component: DepartmentGroupPermissionComponent;
  let fixture: ComponentFixture<DepartmentGroupPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentGroupPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentGroupPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
