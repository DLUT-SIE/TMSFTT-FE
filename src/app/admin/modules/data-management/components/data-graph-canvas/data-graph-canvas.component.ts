import { Component, OnInit , Input} from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

@Component({
  selector: 'app-data-graph-canvas',
  templateUrl: './data-graph-canvas.component.html',
  styleUrls: ['./data-graph-canvas.component.css']
})
export class DataGraphCanvasComponent implements OnInit {

  @Input() graphTypeName: string;
  @Input() isCoverageGraph: boolean;
  @Input() selectedDepartmentName: string;
  @Input() set graphParam(val: DataGraphConfiguration) {
    if (!(val && Object.keys(val)))return;
    const titleYear = val.selectedStartYear === val.selectedEndYear ?
        `${val.selectedStartYear}` : `${val.selectedStartYear}~${val.selectedEndYear}`;
    const title = `${titleYear}-${this.selectedDepartmentName}-${this.graphTypeName}`;
    if (this.isCoverageGraph) {
        this.pieEchartsInstance = null;
    }
    this.buildPieChartOption(title);
    this.buildBarChartOption(title);
    if (this.pieEchartsInstance && this.pieEchartsInstance !== null) {
        this.pieEchartsInstance.setOption(this.pieChartOption);
    }
    if (this.barEchartsInstance) {
        this.barEchartsInstance.setOption(this.barChartOption);
    }
  }

  barChartOption?: EChartOption;
  pieChartOption?: EChartOption;
  pieEchartsInstance: echarts.ECharts;
  barEchartsInstance: echarts.ECharts;

  // TODO(wangyang): Following two variables should be assigned by calling relevant services
  xAxisList: string[] = ['a', 'b', 'c', 'd', 'e'];
  seriesData: GraphData[] = [
    {seriesNum: 0, seriesName: '专任教师', data: [120, 101, 90, 134, 230]},
    {seriesNum: 1, seriesName: '其他', data: [320, 301, 390, 302, 330]}
  ];

  baseDoubleBarChartOption: EChartOption = {
    legend: {
        data: ['', ''],
        x: '10%',
        y: '7%'
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
        max: 500,
        splitLine: {
            show: false
        }
    },
    xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
            interval: 0,
            rotate: 0
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
        y: '7%'
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
        data: []
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
        left: '',
        textAlign: 'center',
        top: 20,
    }],

    tooltip: {
        trigger: 'item',
        formatter: '{c} ({d}%)'
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['25%', '50%'],
            data: [],
            roseType: 'radius',

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay:  () => {
                /* istanbul ignore next */
                return Math.random() * 200;
            }
        }
    ]
  };

  onPieChartInit(ec: echarts.ECharts) {
      this.pieEchartsInstance = ec;
      this.pieEchartsInstance.setOption(this.pieChartOption);
  }

  onBarChartInit(ec: echarts.ECharts) {
    this.barEchartsInstance = ec;
    this.barEchartsInstance.setOption(this.barChartOption);
  }

  buildPieChartOption(title: string) {
    this.pieChartOption = this.basePieChartOption;
    // Expand the series by the length of seriesData which obtained from backend.
    const pieNum = this.seriesData.length;
    const pieSeries = this.pieChartOption.series[0];
    const pieTitle = this.pieChartOption.title[0];
    const pieSeriesLength = this.pieChartOption.series.length;
    for (let j = 0; j < pieNum; j++) {
        // computing the position of graph center: 25%, 50%.
        const position = ((1/(pieNum*2)+j*(1/pieNum))*100).toString() + '%';
        // build pieSeriesData based on seriesData.
        const data: number[] = this.seriesData[j].data;
        const pieGraphData: PieGraphData[] = [];
        for (let i = 0; i < data.length; i++) {
            pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
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
        this.pieChartOption.title[j].text = title + '-' + this.seriesData[j].seriesName;
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[j]
            .center = [position, '50%'];
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[j]
            .data = pieGraphData;
    }
  }

  buildBarChartOption(title: string) {
    this.barChartOption = this.isCoverageGraph ?
        this.baseCoverageBarChartOption: this.baseDoubleBarChartOption;
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
    (this.barChartOption.legend as echarts.EChartOption.SeriesBar).data = legendList;
  }

  constructor() { }
  ngOnInit() {
  }
}
