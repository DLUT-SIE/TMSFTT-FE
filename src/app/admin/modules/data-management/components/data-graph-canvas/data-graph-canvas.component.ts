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
        `${val.selectedStartYear}` : `${val.selectedStartYear}-${val.selectedEndYear}`;
    const title = `${titleYear} ${this.selectedDepartmentName} ${this.graphTypeName}`;
    for(let i = 0; i < this.seriesData.length; i++){
        const data: number[] = this.seriesData[i].data;
        const pieGraphData: PieGraphData[] = [];
        for (let i = 0; i < data.length; i++) {
            pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
        }
        pieGraphData.sort( (a, b) => a.value - b.value);
        (this.basePieChartOption.series as echarts.EChartOption.SeriesPie[])[i].data = pieGraphData;
    }
    this.pieChartOption = this.basePieChartOption;
    (this.pieChartOption.title as echarts.EChartTitleOption[])[0].text = title;
    if (this.pieEchartsInstance && !this.isCoverageGraph && this.showPieGraph) {
        this.pieEchartsInstance.setOption(this.pieChartOption);
    }
    this.showPieGraph = this.isCoverageGraph ? false : true;
    this.barChartOption = this.isCoverageGraph ? this.baseCoverageBarChartOption : this.baseDoubleBarChartOption;
    (this.barChartOption.title as echarts.EChartTitleOption[])[0].text = title;
    if (this.barEchartsInstance) this.barEchartsInstance.setOption(this.barChartOption);
  }

  showPieGraph = true;
  barChartOption?: EChartOption;
  pieChartOption?: EChartOption;
  pieEchartsInstance: echarts.ECharts;
  barEchartsInstance: echarts.ECharts;

  // TODO(wangyang): Following two variables should be assigned by calling relevant services
  xAxisList: string[] = ['a', 'b', 'c', 'd', 'e'];
  seriesData: GraphData[] = [
    {seriesNum: 0, data: [120, 101, 90, 134, 230]},
    {seriesNum: 1, data: [320, 301, 390, 302, 330]}
  ];

  baseDoubleBarChartOption: EChartOption = {
    legend: {
        data: ['总人数', '参加培训人数'],
        x: '10%',
        y: '0%'
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
        data: this.xAxisList,
        axisLabel: {
            interval: 0,
            rotate: 0
        },
        splitLine: {
            show: false
        }
    },
    series: [{
        name: '总人数',
        type: 'bar',
        barGap: 0,
        itemStyle: {
            normal: {
                color: '#003366'
            }
        },
        z: 3,
        label: {
            normal: {
                position: 'top',
                show: true
            }
        },
        data: this.seriesData[0].data
    }, {
        name: '参加培训人数',
        type: 'bar',
        itemStyle: {
            normal: {
                color: '#e5323e'
            }
        },
        z: 3,
        label: {
            normal: {
                position: 'top',
                show: true
            }
        },
        data: this.seriesData[1].data
    }]
  };

  baseCoverageBarChartOption: EChartOption = {
    legend: {
        data: ['总人数', '培训人数'],
        x: '10%',
        y: '0%'
    },
    title: [{
        text: '',
        left: '50%',
        textAlign: 'center'
    }],
    yAxis:  {
        type: 'value',
        data: ['asd', 'qwe', '111', '3', '4', '12344', '555']
    },
    xAxis: {
        type: 'category',
        data: this.xAxisList
    },
    tooltip: {
        trigger: 'axis',
        formatter:  (c) => {
            /* istanbul ignore next */
            return Math.round(c[0].value / c[1].value * 100) + '%';
        }
    },
    series: [
        {
            name: '培训人数',
            type: 'bar',
            stack: '1',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: this.seriesData[0].data
        },
        {
            name: '总人数',
            type: 'bar',
            stack: '1',
            label: {
                normal: {
                    show: true,
                    position: 'insideTop'
                }
            },
            data: this.seriesData[1].data
        }
    ]
  };
  basePieChartOption: EChartOption = {
    title: [{
        text: '',
        left: 'center',
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
        },
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['75%', '50%'],
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

  constructor() { }
  ngOnInit() {
  }
}
