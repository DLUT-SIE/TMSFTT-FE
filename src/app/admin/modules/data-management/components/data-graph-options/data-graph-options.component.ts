import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { Department } from 'src/app/shared/interfaces/department';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';
import { GraphTypeName } from 'src/app/shared/enums/graph-type.enum';

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const selectedStartYear = control.get('selectedStartYear');
    const selectedEndYear = control.get('selectedEndYear');
    if (selectedStartYear.disabled && selectedEndYear.disabled) {
      return null;
    }

    return selectedStartYear.value && selectedEndYear.value && selectedStartYear.value > selectedEndYear.value ?
           { timeValidator: true } : null;
};

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

  departmentsList: Department[] = [{id: 0, name: '大连理工大学'} as Department];
  statisticsType: OptionType[];


  SelectedParamChangingCheck() {
    this.selectedGraph.get('selectedStatisticsType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      if (this.statisticsType[val].key === GraphTypeName.TEACHERS_STATISTICS) {
        this.selectedGraph.get('selectedStartYear').disable();
        this.selectedGraph.get('selectedEndYear').disable();
      } else {
        this.selectedGraph.get('selectedStartYear').enable();
        this.selectedGraph.get('selectedEndYear').enable();
      }
      this.showDepartmentSelector = this.statisticsType[val]
        .key === GraphTypeName.HOURS_STATISTICS ? false : true;
      this.selectedGraph.patchValue({
        selectedGroupType: null,
        selectedDepartment: this.departmentsList[0]
      });
    });
    this.selectedGraph.get('selectedGroupType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      const first = this.selectedGraph.get('selectedStatisticsType').value;
      const second = this.selectedGraph.get('selectedGroupType').value;
      if (this.statisticsType[first].key === GraphTypeName.HOURS_STATISTICS ||
          this.statisticsType[first].subOption[second].key === 'BY_DEPARTMENT') {
          this.showDepartmentSelector = false;
          this.selectedGraph.patchValue({
            selectedDepartment: this.departmentsList[0]
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
            .selectedStatisticsType].key === GraphTypeName.COVERAGE_STATISTICS;
          const options = {
            option: selectedGraphValues,
            isCoverageGraph,
            graphTypeName,
          } as DataGraphOption;
          this.getOptions.emit(options);
        }
    });
  }

  constructor(
    private fb: FormBuilder,
    private readonly departmentService: DepartmentService,
    private readonly canvasService: CanvasService
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
        selectedDepartment: [this.departmentsList[0]]
        }, { validator: timeValidator });
      this.departmentService.getTopDepartments()
          .subscribe(departments => this.departmentsList = this.departmentsList.concat(departments));
      this.canvasService.getCanvasOptions()
          .subscribe(options => this.statisticsType = options);
      this.SelectedParamChangingCheck();
  }
}
