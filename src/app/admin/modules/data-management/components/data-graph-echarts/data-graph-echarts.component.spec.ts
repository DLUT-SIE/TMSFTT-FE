import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataGraphEchartsComponent } from './data-graph-echarts.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartOption } from 'echarts';

describe('DataGraphEchartsComponent', () => {
  let component: DataGraphEchartsComponent;
  let fixture: ComponentFixture<DataGraphEchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGraphEchartsComponent ],
      imports: [
        NgxEchartsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphEchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setOption', () => {
    const setOption = jasmine.createSpy();
    const chart = {} as echarts.ECharts;
    chart.setOption = setOption;
    component.onChartInit(chart);
    expect(chart.setOption).toHaveBeenCalled();
    const chartOption = {} as EChartOption;
    component.option = chartOption;
    expect(chart.setOption).toHaveBeenCalled();
  });
});
