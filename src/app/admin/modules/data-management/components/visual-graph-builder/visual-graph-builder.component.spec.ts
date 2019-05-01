import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualGraphBuilderComponent } from './visual-graph-builder.component';
import { NgxEchartsModule } from 'ngx-echarts';

describe('VisualGraphBuilderComponent', () => {
  let component: VisualGraphBuilderComponent;
  let fixture: ComponentFixture<VisualGraphBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualGraphBuilderComponent ],
      imports: [ NgxEchartsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualGraphBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
