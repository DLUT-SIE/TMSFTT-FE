import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSubmitComponent } from './batch-submit.component';

describe('BatchSubmitComponent', () => {
  let component: BatchSubmitComponent;
  let fixture: ComponentFixture<BatchSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
