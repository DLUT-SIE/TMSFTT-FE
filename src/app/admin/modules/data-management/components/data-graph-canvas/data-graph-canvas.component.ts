import { Component, OnInit , Input} from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-graph-canvas',
  templateUrl: './data-graph-canvas.component.html',
  styleUrls: ['./data-graph-canvas.component.css']
})
export class DataGraphCanvasComponent implements OnInit {

  @Input() graphTypeName: string;
  @Input() hidePieGraph: boolean;
  @Input() set graphOptions(val: DataGraphConfiguration) {
    if (!(val && Object.keys(val)))return;
    const titleYear = val.selectedStartYear === val.selectedEndYear ?
        `${val.selectedStartYear}` : `${val.selectedStartYear}~${val.selectedEndYear}`;
    const title = `${titleYear}-${val.selectedDepartment.name}-${this.graphTypeName}`;
    if (this.hidePieGraph) {
        this.pieEchartsInstance = null;
    }
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
    this.subscription = this.canvasService.getCanvasData(val).subscribe(canvasData => {
        this.xAxisList = canvasData.label;
        this.seriesData = canvasData.group_by_data;
        this.buildPieChartOption();
        this.buildBarChartOption(title);
        if (this.pieEchartsInstance && this.pieEchartsInstance !== null) {
            this.pieEchartsInstance.clear();
            this.pieEchartsInstance.setOption(this.pieChartOption);
        }
        if (this.barEchartsInstance) {
            this.barEchartsInstance.clear();
            this.barEchartsInstance.setOption(this.barChartOption);
        }
    });
  }

  barChartOption?: EChartOption;
  pieChartOption?: EChartOption;
  pieEchartsInstance: echarts.ECharts;
  barEchartsInstance: echarts.ECharts;

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
        left: '',
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
            center: ['25%', '50%'],
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
  cachedSeriesData: GraphData[] = [];

  onPieChartInit(ec: echarts.ECharts) {
      this.pieEchartsInstance = ec;
      this.pieEchartsInstance.setOption(this.pieChartOption);
  }

  onBarChartInit(ec: echarts.ECharts) {
    this.barEchartsInstance = ec;
    this.barEchartsInstance.setOption(this.barChartOption);
  }

  onPieSecondSeriesDisplay() {
    if (this.seriesData.length > 1) {
        Object.assign(this.cachedSeriesData, this.seriesData);
        this.seriesData.splice(1, this.seriesData.length);
        this.buildPieChartOption();
        this.pieEchartsInstance.clear();
        this.pieEchartsInstance.setOption(this.pieChartOption);
    } else {
        Object.assign(this.seriesData, this.cachedSeriesData);
        this.buildPieChartOption();
        this.pieEchartsInstance.clear();
        this.pieEchartsInstance.setOption(this.pieChartOption);
    }
  }

  buildPieChartOption() {
    this.pieChartOption = this.basePieChartOption;
    // Only SeriesBar's legend data is string[] type and then SeriesPie is number[]
    (this.pieChartOption.legend as echarts.EChartOption.SeriesBar).data = this.xAxisList;
    // Expand the series by the length of seriesData which obtained from backend.
    const pieNum = this.seriesData.length;
    const pieSeries = this.pieChartOption.series[0];
    const pieTitle = this.pieChartOption.title[0];
    const pieSeriesLength = this.pieChartOption.series.length;
    for (let j = 0; j < pieNum; j++) {
        // computing the position of graph center: 25%, 50%.
        const position = ((1 / (pieNum * 2) + j * (1 / pieNum)) * 100).toString() + '%';
        // build pieSeriesData based on seriesData.
        const data: number[] = this.seriesData[j].data;
        const pieGraphData: PieGraphData[] = [];
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
            sum += data[i];
        }
        pieGraphData.sort( (a, b) => a.value - b.value);
        // Add a series when the length of the current series small than seriesData's length.
        if (j >= pieSeriesLength) {
            (this.pieChartOption.title as echarts.EChartTitleOption[]).push(
                JSON.parse(JSON.stringify(pieTitle)));
            (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])
                .push(JSON.parse(JSON.stringify(pieSeries)));
        }
        // Assign the prepared data to pieChartOption.
        this.pieChartOption.title[j].left = position;
        this.pieChartOption.title[j].text = this.seriesData[j].seriesName + '占比';
        this.pieChartOption.title[j].subtext = '总计: ' + sum;
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[j]
            .center = [position, '50%'];
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[j]
            .data = pieGraphData;
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[j]
            .name = this.seriesData[j].seriesName;
    }
    this.pieChartOption.series.splice(pieNum, this.pieChartOption.series.length);
    (this.pieChartOption.title as echarts.EChartTitleOption[]).splice(
        pieNum, this.pieChartOption.series.length);
  }

  buildBarChartOption(title: string) {
    this.barChartOption = this.hidePieGraph ?
        this.baseCoverageBarChartOption : this.baseDoubleBarChartOption;
    (this.barChartOption.xAxis as echarts.EChartOption.SeriesBar).data = this.xAxisList;
    (this.barChartOption.title as echarts.EChartTitleOption[])[0].text = title;
    // Expand the series based on the length of seriesData which obtained from backend.
    const barSeriesLength = this.barChartOption.series.length;
    const barSeries = this.barChartOption.series[0];
    const legendList: string[] = [];
    for (let i = 0; i < this.seriesData.length; i++) {
        legendList.push(this.seriesData[i].seriesName);
        // Add a series when the length of the current series small than seriesData's length.
        if (i >= barSeriesLength) {
            this.barChartOption.series.push(JSON.parse(JSON.stringify(barSeries)));
        }
        (this.barChartOption.series as echarts.EChartOption.SeriesBar[])[i]
            .name = this.seriesData[i].seriesName;
        (this.barChartOption.series as echarts.EChartOption.SeriesBar[])[i]
            .data = this.seriesData[i].data;
    }
    this.barChartOption.series.splice(this.seriesData.length, this.barChartOption.series.length);
    (this.barChartOption.legend as echarts.EChartOption.SeriesBar).data = legendList;
  }

  constructor(
    private readonly canvasService: CanvasService,
  ) { }
  ngOnInit() {
  }
}
