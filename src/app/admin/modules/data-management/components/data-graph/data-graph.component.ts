import { Component, OnInit } from '@angular/core';
import { Graph } from 'src/app/shared/interfaces/graph';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const selectedStartYear = control.get('selectedStartYear');
    const selectedEndYear = control.get('selectedEndYear');

    return selectedStartYear.value && selectedEndYear.value && selectedStartYear.value > selectedEndYear.value ?
           { timeValidator: true } : null;
};


@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})

export class DataGraphComponent implements OnInit {

  private currentYear: number;
  private startYear: number;
  selectedGraphValues: {
    selectedGraphType: number,
    selectedGroupType: number,
    selectedStartYear: number,
    selectedEndYear: number,
    selectedDepartment: string
  };
  selectedGraph: FormGroup;
  showDepartmentSelector: boolean;
  startYearList: number[];
  endYearList: number[];

  statisticsType: Graph[] = [{id: 0 , name: '教职工人数统计'}, {id: 1, name: '培训人数统计'},
                               {id: 2, name: '专任教师培训覆盖率统计'}, {id: 3, name: '培训学时与工作量统计'}];
  peopleLabelType: Graph[] = [{id: 0, name: '按学院'}, {id: 1, name: '按人员类别'}, {id: 2, name: '按职称'},
                                {id: 3, name: '按最高学位'}, {id: 4, name: '按年龄分布'}];
  trainLabelType: Graph[] = [{id: 0, name: '按学院'}, {id: 1, name: '按职称'}, {id: 2, name: '按年龄'}];
  trainHourLabelType: Graph[] = [{id: 0, name: '按总数'}, {id: 1, name: '按总学时'}, {id: 2, name: '按人均学时'},
                                    {id: 3, name: '按总工作量'}, {id: 4, name: '按人均工作量'}];
  departmentsList: string[] = ['全校', '创新创业学院', '电信学部', '机械学部', '管经学部'];

  secondType = [this.peopleLabelType, this.trainLabelType, this.trainLabelType, this.trainHourLabelType];

  get selectedGraphType() {
    return this.selectedGraph.get('selectedGraphType');
  }

  get selectedGroupType() {
    return this.selectedGraph.get('selectedGroupType');
  }

  get selectedStartYear() {
      return this.selectedGraph.get('selectedStartYear');
  }

  get selectedEndYear() {
      return this.selectedGraph.get('selectedEndYear');
  }

  get selectedDepartment() {
      return this.selectedGraph.get('selectedDepartment');
  }

  Docheck() {
    this.selectedGraphType.valueChanges.subscribe(val => {
        if (val > 2) {
            this.showDepartmentSelector = false;
        } else {
            this.showDepartmentSelector = true;
        }
        this.selectedGraph.patchValue({selectedGroupType: null, selectedDepartment: '全校'});
      });
    this.selectedGroupType.valueChanges.subscribe(val => {
        if (val === null)return;
        if (this.selectedGraphType.value > 2 || val === 0) {
            this.showDepartmentSelector = false;
            this.selectedGraph.patchValue({selectedDepartment: '全校'});
        } else {
            this.showDepartmentSelector = true;
        }
    });
    this.selectedGraph.statusChanges.subscribe(val => {
        if (val === 'VALID')this.selectedGraphValues = this.selectedGraph.value;
    });
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
      this.currentYear = (new Date()).getFullYear();
      this.startYear = 2014;
      this.showDepartmentSelector = true;
      this.selectedGraph = this.fb.group({
        selectedGraphType: [null, Validators.required],
        selectedGroupType: [null, Validators.required],
        selectedStartYear: [this.currentYear, Validators.required],
        selectedEndYear: [this.currentYear, Validators.required],
        selectedDepartment: ['全校']
        }, { validator: timeValidator });
      this.selectedGraphValues = null;
      this.Docheck();
      this.startYearList = [];
      this.endYearList = [];
      let i: number;
      for (i = this.startYear; i <= this.currentYear; i ++) {
          this.startYearList.push(i);
          this.endYearList.push(i);
      }
  }
}
