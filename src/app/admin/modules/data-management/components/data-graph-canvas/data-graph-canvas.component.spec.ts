import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphCanvasComponent } from './data-graph-canvas.component';
import { NgxEchartsModule } from 'ngx-echarts';

describe('DataGraphCanvasComponent', () => {
  let component: DataGraphCanvasComponent;
  let fixture: ComponentFixture<DataGraphCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGraphCanvasComponent ],
      imports: [ NgxEchartsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
