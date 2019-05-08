import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { Department } from 'src/app/shared/interfaces/department';
import { CanvasOptionsService } from 'src/app/shared/services/data/canvas-options.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const selectedStartYear = control.get('selectedStartYear');
    const selectedEndYear = control.get('selectedEndYear');

    return selectedStartYear.value && selectedEndYear.value && selectedStartYear.value > selectedEndYear.value ?
           { timeValidator: true } : null;
};
const WHOLE_SCHOOL = 0;

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnInit {

  selectedGraphValues: DataGraphConfiguration = null;
  selectedGraph: FormGroup;
  showDepartmentSelector = true;
  yearList: number[] = [];

  departmentsList: Department[] = [{id: 0, name: '全校'} as Department];
  statisticsType: OptionType[];

  get graphTypeName() {
    return this.selectedGraphValues === null ? '' : this.statisticsType[
      this.selectedGraphValues.selectedStatisticsType].name;
  }

  get isCoverageGraph() {
    return this.selectedGraphValues === null ? false :
    this.statisticsType[this.selectedGraphValues.selectedStatisticsType].key ===
      'FULL_TIME_TEACHER_TRAINED_COVERAGE';
  }

  get selectedDepartmentName() {
    return this.selectedGraphValues === null ? '' : this.departmentsList[
      this.selectedGraphValues.selectedDepartment].name;
  }

  SelectedParamChangingCheck() {
    this.selectedGraph.get('selectedStatisticsType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      this.showDepartmentSelector = this.statisticsType[val]
        .key === 'TRAINING_HOURS_WORKLOAD_STATISTICS' ? false : true;
      this.selectedGraph.patchValue({
        selectedGroupType: null,
        selectedDepartment: WHOLE_SCHOOL
      });
    });
    this.selectedGraph.get('selectedGroupType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      const first = this.selectedGraph.get('selectedStatisticsType').value;
      const second = this.selectedGraph.get('selectedGroupType').value;
      if (this.statisticsType[first].key === 'TRAINING_HOURS_WORKLOAD_STATISTICS' ||
          this.statisticsType[first].subOption[second].key === 'BY_DEPARTMENT') {
          this.showDepartmentSelector = false;
          this.selectedGraph.patchValue({
            selectedDepartment: WHOLE_SCHOOL
          });
      } else {
          this.showDepartmentSelector = true;
      }
    });
    this.selectedGraph.statusChanges.subscribe(val => {
        if (val === 'VALID') {
          this.selectedGraphValues = this.selectedGraph.value;
        }
    });
  }

  constructor(
    private fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly canvasOptionsService: CanvasOptionsService
    ) { }

  ngOnInit() {
      for (let i = 2016; i <= (new Date()).getFullYear(); i++) {
          this.yearList.push(i);
      }
      this.selectedGraph = this.fb.group({
        selectedStatisticsType: [null, Validators.required],
        selectedGroupType: [null, Validators.required],
        selectedStartYear: [this.yearList[this.yearList.length - 1], Validators.required],
        selectedEndYear: [this.yearList[this.yearList.length - 1], Validators.required],
        selectedDepartment: [WHOLE_SCHOOL]
        }, { validator: timeValidator });
      this.departmentService.getDepartments({offset: 0, limit: 100} as ListRequest)
          .subscribe(departments => this.departmentsList = this.departmentsList.concat(departments.results));
      this.canvasOptionsService.getCanvasOptions()
          .subscribe(options => this.statisticsType = options);
      this.SelectedParamChangingCheck();
  }
}
