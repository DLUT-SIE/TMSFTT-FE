import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularUserComponent } from './regular-user.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegularUserComponent', () => {
  let component: RegularUserComponent;
  let fixture: ComponentFixture<RegularUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ RegularUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
