import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { Department } from 'src/app/shared/interfaces/department';
import { CanvasOptionsService } from 'src/app/shared/services/data/canvas-options.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const selectedStartYear = control.get('selectedStartYear');
    const selectedEndYear = control.get('selectedEndYear');

    return selectedStartYear.value && selectedEndYear.value && selectedStartYear.value > selectedEndYear.value ?
           { timeValidator: true } : null;
};
const WHOLE_SCHOOL = 0;

@Component({
  selector: 'app-data-graph-options',
  templateUrl: './data-graph-options.component.html',
  styleUrls: ['./data-graph-options.component.css']
})
export class DataGraphOptionsComponent implements OnInit {

  @Output() getOptions = new EventEmitter();
  selectedGraph: FormGroup;
  showDepartmentSelector = true;
  yearList: number[] = [];

  departmentsList: Department[] = [{id: 0, name: '全校'} as Department];
  statisticsType: OptionType[];

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
          const selectedGraphValues = this.selectedGraph.value;
          const graphTypeName = this.statisticsType[selectedGraphValues
            .selectedStatisticsType].name;
          const isCoverageGraph = this.statisticsType[selectedGraphValues
            .selectedStatisticsType].key === 'FULL_TIME_TEACHER_TRAINED_COVERAGE';
          const selectedDepartmentName = this.departmentsList[selectedGraphValues
            .selectedDepartment].name;
          const options = {
            option: selectedGraphValues,
            isCoverageGraph,
            graphTypeName,
            selectedDepartmentName
          } as DataGraphOption;
          this.getOptions.emit(options);
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
