import { Component, OnInit , Input, ViewChild, ViewContainerRef,
    ComponentFactory, ComponentRef, ComponentFactoryResolver, OnDestroy} from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { Subscription } from 'rxjs';
import { DataGraphEchartsComponent } from '../data-graph-echarts/data-graph-echarts.component';

@Component({
  selector: 'app-data-graph-canvas',
  templateUrl: './data-graph-canvas.component.html',
  styleUrls: ['./data-graph-canvas.component.css']
})
export class DataGraphCanvasComponent implements OnInit, OnDestroy  {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  @Input() graphTypeName: string;
  @Input() hidePieGraph: boolean;
  @Input() set graphOptions(val: DataGraphConfiguration) {
    if (!(val && Object.keys(val)))return;
    const titleYear = val.selectedStartYear === val.selectedEndYear ?
        `${val.selectedStartYear}` : `${val.selectedStartYear}~${val.selectedEndYear}`;
    const title = `${titleYear}-${val.selectedDepartment.name}-${this.graphTypeName}`;
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
    this.subscription = this.canvasService.getCanvasData(val).subscribe(canvasData => {
        this.xAxisList = canvasData.label;
        this.seriesData = canvasData.group_by_data;
        this.buildPieChartOption();
        this.buildBarChartOption(title);
        this.container.clear();
        this.componentRefList = [];
        for (const pieChartOption of this.pieChartOptionList) {
            const factory: ComponentFactory<DataGraphEchartsComponent> =
                this.resolver.resolveComponentFactory(DataGraphEchartsComponent);
            const componentRef = this.container.createComponent(factory);
            componentRef.instance.option = pieChartOption;
            this.componentRefList.push(componentRef);
        }
    });
  }

  barChartOption?: EChartOption;
  pieChartOptionList?: EChartOption[];

  xAxisList: string[];
  seriesData: GraphData[];

  baseDoubleBarChartOption: EChartOption = {
    legend: {
        data: ['', ''],
        x: '10%',
        y: '5%'
    },
    tooltip: {
    formatter: '{c0}'
    },
    title: [{
        text: '',
        left: '50%',
        textAlign: 'center'
    }],
    yAxis: {
        type: 'value',
        splitLine: {
            show: false
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 330
        },
        splitLine: {
            show: false
        }
    },
    series: [{
        name: '',
        type: 'bar',
        barGap: 0,
        z: 3,
        label: {
            normal: {
                position: 'top',
                show: true
            }
        },
        data: []
    }]
  };

  baseCoverageBarChartOption: EChartOption = {
    legend: {
        data: ['', ''],
        x: '10%',
        y: '5%'
    },
    title: [{
        text: '',
        left: '50%',
        textAlign: 'center'
    }],
    yAxis:  {
        type: 'value'
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 330
        },
    },
    tooltip: {
        trigger: 'axis',
        formatter:  (c) => {
            /* istanbul ignore next */
            return Math.round((c[0]).value / (
                c[0].value + c[1].value) * 100) + '%';
        }
    },
    series: [
        {
            name: '',
            type: 'bar',
            stack: '1',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: []
        }
    ]
  };
  basePieChartOption: EChartOption = {
    title: [{
        text: '',
        subtext: '',
        left: '50%',
        textAlign: 'center',
    }],

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        type: 'scroll',
        orient: 'horizontal',
        y: '85%',
        data: ['']
    },
    series: [
        {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [],
            label: {
                normal: {
                    show: true,
                    formatter: '{b}: ({d}%)'
                }
            },
            labelLine: {
                normal: {
                    length: 1
                }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay:  () => {
                /* istanbul ignore next */
                return Math.random() * 200;
            }
        }
    ]
  };

  private subscription: Subscription;
  private componentRefList: Array<ComponentRef<DataGraphEchartsComponent>>;

  buildPieChartOption() {
    this.pieChartOptionList = [];
    // Only SeriesBar's legend data is string[] type and then SeriesPie is number[]
    (this.basePieChartOption.legend as echarts.EChartOption.SeriesBar).data = this.xAxisList;
    // Expand the series by the length of seriesData which obtained from backend.
    const pieNum = this.seriesData.length;
    for (let j = 0; j < pieNum; j++) {
        // build pieSeriesData based on seriesData.
        const data: number[] = this.seriesData[j].data;
        const pieGraphData: PieGraphData[] = [];
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] !== 0) {
                pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
                sum += data[i];
            } else {
                pieGraphData.push({value: null, name: this.xAxisList[i]} as PieGraphData);
            }
        }
        pieGraphData.sort( (a, b) => a.value - b.value);
        // Assign the prepared data to pieChartOption.
        this.basePieChartOption.title[0].text = this.seriesData[j].seriesName + '占比';
        this.basePieChartOption.title[0].subtext = '总计: ' + sum;
        (this.basePieChartOption.series as echarts.EChartOption.SeriesPie[])[0]
            .data = pieGraphData;
        (this.basePieChartOption.series as echarts.EChartOption.SeriesPie[])[0]
            .name = this.seriesData[j].seriesName;
        if (sum !== 0) {
            this.pieChartOptionList.push(JSON.parse(JSON.stringify(this.basePieChartOption)));
        }
    }
  }

  buildBarChartOption(title: string) {
    const chartOption = this.hidePieGraph ?
        this.baseCoverageBarChartOption : this.baseDoubleBarChartOption;
    (chartOption.xAxis as echarts.EChartOption.SeriesBar).data = this.xAxisList;
    (chartOption.title as echarts.EChartTitleOption[])[0].text = title;
    // Expand the series based on the length of seriesData which obtained from backend.
    const barSeriesLength = chartOption.series.length;
    const barSeries = chartOption.series[0];
    const legendList: string[] = [];
    for (let i = 0; i < this.seriesData.length; i++) {
        legendList.push(this.seriesData[i].seriesName);
        // Add a series when the length of the current series small than seriesData's length.
        if (i >= barSeriesLength) {
            chartOption.series.push(JSON.parse(JSON.stringify(barSeries)));
        }
        (chartOption.series as echarts.EChartOption.SeriesBar[])[i]
            .name = this.seriesData[i].seriesName;
        (chartOption.series as echarts.EChartOption.SeriesBar[])[i]
            .data = this.seriesData[i].data;
    }
    chartOption.series.splice(this.seriesData.length, chartOption.series.length);
    (chartOption.legend as echarts.EChartOption.SeriesBar).data = legendList;
    this.barChartOption = JSON.parse(JSON.stringify(chartOption));
  }

  constructor(
    private readonly canvasService: CanvasService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
      for (const componentRef of this.componentRefList) {
          componentRef.destroy();
      }
  }
}
