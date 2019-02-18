import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPermissionComponent } from './account-permission.component';

describe('AccountPermissionComponent', () => {
  let component: AccountPermissionComponent;
  let fixture: ComponentFixture<AccountPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
