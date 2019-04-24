import { Component, OnInit, DoCheck } from '@angular/core';
import { Graph } from 'src/app/shared/interfaces/graph';

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})

export class DataGraphComponent implements OnInit, DoCheck {
  selected_graph_type ?: number;
  selected_group_type ?: number;
  old_selected_graph_type ?:number;

  statistics_type : Graph[] = [{id:0 , name:'教职工人数统计'}, {id:1, name:'培训人数统计'},
                               {id:2, name:'专任教师培训覆盖率统计'}, {id:3, name:'培训学时与工作量统计'}];
  people_label_type: Graph[] = [{id:0, name:'按人员类别'}, {id:1, name:'按职称'}, {id:2, name:'按最高学位'},
                          {id:3, name:'按年龄分布'}];
  train_label_type: Graph[] = [{id:0, name:'按学院'}, {id:1, name:'按职称'}, {id:2, name:'按年龄'}];
  train_hour_label_type: Graph[] = [{id:0, name:'按总数'}, {id:1, name:'按总学时'}, {id:2, name:'按人均学时'},
                                    {id:3, name:'按总工作量'}, {id:4, name:'按人均工作量'}];

  
  second_type = [this.people_label_type, this.train_label_type, this.train_label_type, this.train_hour_label_type];
  chartOption = {
    backgroundColor: {
        type: 'pattern',
        image: document.createElement('canvas'),
        repeat: 'repeat'
    },
    legend: {
        data:['总人数','参加培训人数'],
        x: '25%',
        y: '0%'
    },
    tooltip: {
    formatter:function(c){
      return c.value+"%";
      }
    },
    title: [{
        text: '专任教师占比',
        x: '75%',
        y: '10%',
        textAlign: 'center'
    },{
        text: '外聘教师占比',
        x: '75%',
        y: '55%',
        textAlign: 'center'
    }],
     grid: [{
        top: '10%',
        width: '50%',
        bottom: 0,
        left: 10,
        containLabel: true
    }],
    yAxis: [{
        type: 'value',
        max: 8000,
        splitLine: {
            show: false
        }
    }],
    xAxis: [{
        type: 'category',
        data: ['aa','ss','ff','aa','gff','asd'],
        axisLabel: {
            interval: 0,
            rotate: 0
        },
        splitLine: {
            show: false
        }
    },],
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
        data: [3237, 2164, 7561, 7778, 7355, 2405]
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
        data: [ 1267,3164,5761,6678,4455,3405]
    },{
        type: 'pie',
        radius: [0, '30%'],
        center: ['75%', '35%'],
        data: [{value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'},
                {value:400, name:'搜索引擎'}]
    },{
        type: 'pie',
        radius: [0, '30%'],
        center: ['75%', '80%'],
        data: [{value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:274, name:'联盟广告'},
                {value:235, name:'视频广告'},
                {value:400, name:'搜索引擎'}]
    }]
};
                          
  constructor() { }

  ngOnInit() {
  }

  ngDoCheck(){
    if(this.selected_graph_type && this.selected_group_type){
      //TODO build option
    }

    if(this.selected_graph_type && this.selected_graph_type !== this.old_selected_graph_type){
      this.old_selected_graph_type = this.selected_graph_type;
      this.selected_group_type = 0;
    }
  }
}
