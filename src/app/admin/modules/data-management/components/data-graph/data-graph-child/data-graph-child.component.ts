import { Component, OnInit , Input, ViewChild, ElementRef} from '@angular/core';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { Graph } from 'src/app/shared/interfaces/graph';
import { GraphData } from 'src/app/shared/interfaces/graph-data';
import { PieGraphData } from 'src/app/shared/interfaces/pie-graph-data';

@Component({
  selector: 'app-data-graph-child',
  templateUrl: './data-graph-child.component.html',
  styleUrls: ['./data-graph-child.component.css']
})


export class DataGraphChildComponent implements OnInit {
  @ViewChild('myCharts') myCharts: ElementRef;

  @Input() titleGraphNames?: Graph[];
  @Input() isPieGraph: boolean;

  private titleYear: string;
  private titleDepartment: string;
  private pieGraphData?: PieGraphData[] = [];

  chartOption?: EChartOption;
  title: string;
  xAxisList: string[] = ['a', 'b', 'c', 'd', 'e'];
  seriesData: GraphData[] = [{id: 0, data: [120, 101, 90, 134, 230, 132, 210]}, {id: 1, data: [320, 301, 390, 302, 330, 320, 334]}];

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
            data: this.pieGraphData,
            roseType: 'radius',

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay:  () => {
                return Math.random() * 200;
            }
        }
    ]
};

  @Input() set graphParam(val: any) {
    if (!(val && Object.keys(val)))return;
    this.titleYear = val.selectedStartYear === val.selectedEndYear ?
        `${val.selectedStartYear}` : `${val.selectedStartYear}-${val.selectedEndYear}`;
    this.titleDepartment = val.selectedDepartment;
    this.title = `${this.titleYear} ${this.titleDepartment} ${this.titleGraphNames[val.selectedGraphType].name}`;

    if (this.isPieGraph) {
        const data: number[] = this.seriesData[0].data;
        let i: number;
        this.pieGraphData = [];
        for (i = 0; i < data.length; i ++) {
            this.pieGraphData.push({value: data[i], name: this.xAxisList[i]} as PieGraphData);
        }
        this.pieGraphData.sort( (a, b) => a.value - b.value);
        this.pieChartOption.title = [{
          text: this.title,
          left: 'center',
          top: 20,
          textStyle: {
              color: '#cccc'
          }
        }];
        this.pieChartOption.series = [
          {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: this.pieGraphData,
              roseType: 'radius',
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: () => {
                  return Math.random() * 200;
              }
          }
        ];
        echarts.getInstanceByDom(this.myCharts.nativeElement).setOption(this.pieChartOption);
    } else {
      if (val.selectedGraphType === 0 || val.selectedGraphType === 2)this.chartOption = this.doubleBarChartOption;
      else this.chartOption = this.barChartOption;
    }
  }
  constructor() { }
  ngOnInit() {
    this.chartOption = this.pieChartOption;
  }
}
