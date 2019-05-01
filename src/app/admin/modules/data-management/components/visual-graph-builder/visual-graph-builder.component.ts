import { Component, OnInit , Input} from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';
import { ParamSelector } from 'src/app/shared/interfaces/visual-graph-param-selector';

@Component({
  selector: 'app-visual-graph-builder',
  templateUrl: './visual-graph-builder.component.html',
  styleUrls: ['./visual-graph-builder.component.css']
})

export class VisualGraphBuilderComponent implements OnInit {

  @Input() titleGraphNames: string;
  @Input() isPieGraph: boolean;

  chartOption?: EChartOption;
  echartsInstance: echarts.ECharts;
  pieGraphData: PieGraphData[] = [];
  title: string;

  // Following two variables should be assigned by calling relevant services
  xAxisList: string[] = ['a', 'b', 'c', 'd', 'e'];
  seriesData: GraphData[] = [{id: 0, data: [120, 101, 90, 134, 230, 132, 210]}, {id: 1, data: [320, 301, 390, 302, 330, 320, 334]}];

  private titleYear: string;
  private titleDepartment: string;

  doubleBarChartOption: EChartOption = {
    legend: {
        data: ['总人数', '参加培训人数'],
        x: '10%',
        y: '0%'
    },
    tooltip: {
    formatter: '{c0}'
    },
    title: {
        text: this.title,
        left: '50%',
        textAlign: 'center'
    },
    yAxis: {
        type: 'value',
        max: 8000,
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

  barChartOption: EChartOption = {
    legend: {
        data: ['总人数', '培训人数']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
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
  pieChartOption: EChartOption = {
    title: [{
        text: this.title,
        left: 'center',
        top: 20,
        textStyle: {
            color: '#cccc'
        }
    }],

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },

    visualMap: [{
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    }],
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [],
            roseType: 'radius',

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay:  () => {
                return Math.random() * 200;
            }
        }
    ]
  };

  @Input() set graphParam(val: ParamSelector) {
    if (!(val && Object.keys(val)))return;
    this.titleYear = val.selectedStartYear === val.selectedEndYear ?
        `${val.selectedStartYear}` : `${val.selectedStartYear}-${val.selectedEndYear}`;
    this.titleDepartment = val.selectedDepartment;
    this.title = `${this.titleYear} ${this.titleDepartment} ${this.titleGraphNames}`;

    if (this.isPieGraph) {
        const data: number[] = this.seriesData[0].data;
        this.pieGraphData = [];
        for (let i = 0; i < data.length; i ++) {
            this.pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
        }
        this.pieGraphData.sort( (a, b) => a.value - b.value);
        (this.pieChartOption.title as echarts.EChartTitleOption[])[0].text = this.title;
        (this.pieChartOption.series as echarts.EChartOption.SeriesPie[])[0].data = this.pieGraphData;
        this.chartOption = this.pieChartOption;
    } else {
      if (val.selectedStatisticsType === 0 || val.selectedStatisticsType === 2)this.chartOption = this.doubleBarChartOption;
      else this.chartOption = this.barChartOption;
    }
    if (this.echartsInstance) this.echartsInstance.setOption(this.chartOption);
  }

  onChartInit(ec: echarts.ECharts) {
      this.echartsInstance = ec;
      this.echartsInstance.setOption(this.chartOption);
  }
  constructor() { }
  ngOnInit() {
  }
}
