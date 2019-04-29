import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphChildComponent } from './data-graph-child.component';
import { NgxEchartsModule } from 'ngx-echarts';

describe('DataGraphChildComponent', () => {
  let component: DataGraphChildComponent;
  let fixture: ComponentFixture<DataGraphChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataGraphChildComponent ],
      imports:[
        NgxEchartsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGraphChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
