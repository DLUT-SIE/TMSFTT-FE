import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataGraphComponent } from './data-graph.component';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { AppDataGraphOptionsStub} from 'src/testing/app-data-graph-options-stub';
import { AppDataGraphCanvasStub} from 'src/testing/app-data-graph-canvas-stub';
describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataGraphComponent,
        AppDataGraphOptionsStub,
        AppDataGraphCanvasStub
      ],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        NgxEchartsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule
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
    expect(component.isCoverageGraph).toEqual(options.isCoverageGraph);
    expect(component.graphTypeName).toEqual(options.graphTypeName);
  });
});
