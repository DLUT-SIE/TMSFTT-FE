import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryAnalysisComponent } from './summary-analysis.component';

describe('SummaryAnalysisComponent', () => {
  let component: SummaryAnalysisComponent;
  let fixture: ComponentFixture<SummaryAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
