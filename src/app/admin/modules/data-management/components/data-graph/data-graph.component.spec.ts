import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataGraphComponent } from './data-graph.component';
import { DataGraphCanvasComponent } from '../data-graph-canvas/data-graph-canvas.component';
import { DataGraphOptionsComponent } from '../data-graph-options/data-graph-options.component';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { DataGraphEchartsComponent } from '../data-graph-echarts/data-graph-echarts.component';

describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataGraphComponent,
        DataGraphCanvasComponent,
        DataGraphOptionsComponent,
        DataGraphEchartsComponent
      ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOptions', () => {
    const options = {
      option: {} as DataGraphConfiguration,
      isCoverageGraph: true,
      graphTypeName: '123',
    } as DataGraphOption;
    component.getOptions(options);
    expect(component.graphOptions).toEqual(options.option);
    expect(component.hidePieGraph).toEqual(options.isCoverageGraph);
    expect(component.graphTypeName).toEqual(options.graphTypeName);
  });
});
