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
  @ViewChild('myCharts') myCharts:ElementRef;

  @Input() title_graph_names?: Graph[];
  @Input() is_pie_grah: boolean;

  private title_year : string;
  private title_department :string;
  private pie_graph_data?: PieGraphData[] = [];
  chartOption ?: EChartOption;
  title: string;
  xAxis_list : string[] = ['a', 'b', 'c', 'd', 'e'];
  series_data: GraphData[] = [{id:0, data:[120, 101, 90, 134, 230, 132, 210]},{id:1, data: [320, 301, 390, 302, 330, 320, 334]}];

  double_bar_chartOption: EChartOption = {
    legend: {
        data:['总人数','参加培训人数'],
        x: '10%',
        y: '0%'
    },
    tooltip: {
    formatter:'{c0}'
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
        data: this.xAxis_list,
        axisLabel: {
            interval: 0,
            rotate: 0
        },
        splitLine: {
            show: false
        }
    },
    series: [ {
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
        data: this.series_data[0].data
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
        data: this.series_data[1].data
    }]
};

bar_chartOption: EChartOption = {
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
        data: ['asd','qwe','111','3','4','12344','555']
    },
    xAxis: {
        type: 'category',
        data: this.xAxis_list
    },
    tooltip : {
    trigger: 'axis',
    formatter:function(c){
    return Math.round(c[0].value/c[1].value * 100)+"%";
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
            data: this.series_data[0].data
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
            data: this.series_data[1].data
        }
    ]
};
pie_chartOption: EChartOption = {

    title: [{
        text: this.title,
        left: 'center',
        top: 20,
        textStyle: {
            color: '#cccc'
        }
    }],

    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: [{
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    }],
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '50%'],
            data: this.pie_graph_data,
            roseType: 'radius',

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};

  @Input() set graph_param(val:any){
    if(!(val && Object.keys(val)))return;
    this.title_year = val.selected_start_year === val.selected_end_year ? 
        `${val.selected_start_year}`: `${val.selected_start_year}-${val.selected_end_year}`;
    this.title_department = val.selected_department;
    this.title = `${this.title_year} ${this.title_department} ${this.title_graph_names[val.selected_graph_type].name}`;

    if(this.is_pie_grah){
        var data:number[] = this.series_data[0].data;
        var i:number;
        this.pie_graph_data = [];
        for(i = 0; i < data.length;i ++){
            this.pie_graph_data.push(<PieGraphData>{value:data[i], name:this.xAxis_list[i]});
        }
        this.pie_graph_data.sort(function (a, b) { return a.value - b.value; });
        this.pie_chartOption.title = [{
          text: this.title,
          left: 'center',
          top: 20,
          textStyle: {
              color: '#cccc'
          }
        }];
        this.pie_chartOption.series = [
          {
              name:'访问来源',
              type:'pie',
              radius : '55%',
              center: ['50%', '50%'],
              data: this.pie_graph_data,
              roseType: 'radius',
  
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                  return Math.random() * 200;
              }
          }
        ];
        echarts.getInstanceByDom(this.myCharts.nativeElement).setOption(this.pie_chartOption);
    }
    else{
      if(val.selected_graph_type === 0 || val.selected_graph_type === 2)this.chartOption = this.double_bar_chartOption;
      else this.chartOption = this.bar_chartOption;
    }
  }
  constructor() { }
  ngOnInit() {
    this.chartOption = this.pie_chartOption;
  }
}
