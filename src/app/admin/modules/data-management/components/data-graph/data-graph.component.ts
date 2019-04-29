import { Component, OnInit } from '@angular/core';
import { Graph } from 'src/app/shared/interfaces/graph';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';

export const TimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const selected_start_year = control.get('selected_start_year');
    const selected_end_year = control.get('selected_end_year');
  
    return selected_start_year.value && selected_end_year.value && selected_start_year.value > selected_end_year.value ? { 'TimeValidator': true } : null;
};


@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})

export class DataGraphComponent implements OnInit {

  private current_year :number;
  private start_year :number;
  selected_graph_values: any;
  selected_graph :FormGroup = new FormGroup({});
  show_department_selector :boolean;
  start_year_list: number[];
  end_year_list: number[];

  get selected_graph_type(){
    return this.selected_graph.get('selected_graph_type');
  }

  get selected_group_type(){
    return this.selected_graph.get('selected_group_type');
  }

  get selected_start_year(){
      return this.selected_graph.get('selected_start_year');
  }

  get selected_end_year(){
      return this.selected_graph.get('selected_end_year');
  }

  get selected_department(){
      return this.selected_graph.get('selected_department');
  }

  Docheck(){
    this.selected_graph_type.valueChanges.subscribe(val => {
        if(val > 2){
            this.show_department_selector = false;
        }
        else{
            this.show_department_selector = true;
        }
        this.selected_graph.patchValue({'selected_group_type':null, 'selected_department':'全校'});
      });
    this.selected_group_type.valueChanges.subscribe(val =>{
        if(val === null)return;
        if(this.selected_graph_type.value > 2 || val === 0){
            this.show_department_selector = false;
            this.selected_graph.patchValue({'selected_department':'全校'});
        }
        else{
            this.show_department_selector = true;
        }
    });
    this.selected_graph.statusChanges.subscribe(val=>{
        if(val === "VALID")this.selected_graph_values = this.selected_graph.value;
    });
  }

  statistics_type : Graph[] = [{id:0 , name:'教职工人数统计'}, {id:1, name:'培训人数统计'},
                               {id:2, name:'专任教师培训覆盖率统计'}, {id:3, name:'培训学时与工作量统计'}];
  people_label_type: Graph[] = [{id:0, name:'按学院'}, {id:1, name:'按人员类别'}, {id:2, name:'按职称'},
                                {id:3, name:'按最高学位'}, {id:4, name:'按年龄分布'}];
  train_label_type: Graph[] = [{id:0, name:'按学院'}, {id:1, name:'按职称'}, {id:2, name:'按年龄'}];
  train_hour_label_type: Graph[] = [{id:0, name:'按总数'}, {id:1, name:'按总学时'}, {id:2, name:'按人均学时'},
                                    {id:3, name:'按总工作量'}, {id:4, name:'按人均工作量'}];
  departments_list: string[] = ['全校','创新创业学院', '电信学部', '机械学部', '管经学部'];
  
  second_type = [this.people_label_type, this.train_label_type, this.train_label_type, this.train_hour_label_type];

                          
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
      this.current_year = (new Date()).getFullYear();
      this.start_year = 2014;
      this.show_department_selector = true;
      this.selected_graph= this.fb.group({
        selected_graph_type: [null, Validators.required],
        selected_group_type: [null, Validators.required],
        selected_start_year: [this.current_year, Validators.required],
        selected_end_year: [this.current_year, Validators.required],
        selected_department: ['全校']
        },{ validator: TimeValidator })
      this.selected_graph_values = null;
      this. Docheck();
      this.start_year_list = [];
      this.end_year_list = [];
      var i:number;
      for(i = this.start_year; i <= this.current_year;i ++){
          this.start_year_list.push(i);
          this.end_year_list.push(i);
      }
  }
}
