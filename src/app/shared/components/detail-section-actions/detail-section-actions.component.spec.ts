import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSectionActionsComponent } from './detail-section-actions.component';

describe('DetailSectionActionsComponent', () => {
  let component: DetailSectionActionsComponent;
  let fixture: ComponentFixture<DetailSectionActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSectionActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSectionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
