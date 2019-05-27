import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { Department } from 'src/app/shared/interfaces/department';
import { CanvasService } from 'src/app/shared/services/data/canvas.service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { DataGraphOption } from 'src/app/shared/interfaces/data-graph-option';
import { ProgramsOption } from 'src/app/shared/interfaces/programs-option';
import { GraphTypeName } from 'src/app/shared/enums/graph-type.enum';
import { Subscription } from 'rxjs';
import { Program } from 'src/app/shared/interfaces/program';

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

  private programsSubsciption: Subscription;
  private cachedDepartmentsList: Department[] = [{id: 0, name: '大连理工大学'} as Department];
  private cachedProgramDepartmentsList: Department[] = [{id: 0, name: '全校'} as Department];
  private groupPrograms: ProgramsOption[] = [];

  @Output() getOptions = new EventEmitter();
  selectedGraph: FormGroup;
  showDepartmentSelector = true;
  yearList: number[] = [];

  departmentsList: Department[] = [{id: 0, name: '大连理工大学'} as Department];
  statisticsType: OptionType[];
  programs: Program[] = [{id: 0, name: '全部项目'} as Program];

  get isCoverageGraph() {
    return this.selectedGraph.value.selectedStatisticsType ? this.statisticsType[
      this.selectedGraph.value.selectedStatisticsType].key === GraphTypeName.COVERAGE_STATISTICS : false;
  }

  get departmentOptionLabel() {
    return this.isCoverageGraph ? '选择项目开设部门' : '选择学院';
  }

  get showGroupTypeSelector() {
    return this.selectedGraph.get('selectedStatisticsType').value !== null ? this.statisticsType[
      this.selectedGraph.get('selectedStatisticsType').value].key !== GraphTypeName.HOURS_STATISTICS : false;
  }

  SelectedParamChangingCheck() {
    this.selectedGraph.get('selectedStatisticsType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      // 判断是否应该展示学院选择组件并在更改绘图类型后恢复其他组件初值
      this.showDepartmentSelector = this.statisticsType[val]
        .key === GraphTypeName.HOURS_STATISTICS ? false : true;
      this.selectedGraph.patchValue({
        selectedGroupType: null,
        selectedProgram: null,
        selectedDepartment: this.departmentsList[0]
      });
      // 选择教师统计图时时间选择组件不可用，其他组件可用
      if (this.statisticsType[val].key === GraphTypeName.TEACHERS_STATISTICS) {
        this.selectedGraph.get('selectedStartYear').disable();
        this.selectedGraph.get('selectedEndYear').disable();
      } else {
        this.selectedGraph.get('selectedStartYear').enable();
        this.selectedGraph.get('selectedEndYear').enable();
      }
      // 覆盖率统计组件需要请求分组项目数据，并将学部学院信息缓存，替换成可选择的部门
      if (this.statisticsType[val].key === GraphTypeName.COVERAGE_STATISTICS) {
        if (this.programsSubsciption === undefined) {
          this.programsSubsciption = this.canvasService.getGroupPrograms()
          .subscribe(programs => {
            this.groupPrograms = programs;
            for (const dep of programs) {
              this.cachedProgramDepartmentsList.push({id: dep.id, name: dep.name} as Department);
            }
          });
        }
        this.departmentsList = this.cachedProgramDepartmentsList;
        this.selectedGraph.patchValue({
          selectedDepartment: this.departmentsList[0]
        });
      } else {
        this.departmentsList = this.cachedDepartmentsList;
      }
      // 培训学时与工作量统计需隐藏分组选择组件，并初始化为0
      if (this.statisticsType[val].key === GraphTypeName.HOURS_STATISTICS) {
        this.selectedGraph.patchValue({selectedGroupType: 0});
      }
    });
    this.selectedGraph.get('selectedDepartment').valueChanges.subscribe(val => {
      // 根据选择的开设学院改变项目组件
      const value = this.selectedGraph.get('selectedStatisticsType').value;
      if (value && this.statisticsType[value].key === GraphTypeName.COVERAGE_STATISTICS) {
        if (val.id === 0) {
          this.programs = [this.programs[0]];
        } else {
          for (const dep of this.groupPrograms) {
            if (dep.id === val.id) {
              this.programs = [this.programs[0]].concat(dep.programs);
              break;
            }
          }
        }
        this.selectedGraph.patchValue({selectedProgram: this.programs[0]});
      }
    });
    this.selectedGraph.get('selectedGroupType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      // 当分组选择按学院统计且统计类型不是覆盖率统计时，应隐藏学院选择组件并恢复其默认
      const first = this.selectedGraph.get('selectedStatisticsType').value;
      const second = this.selectedGraph.get('selectedGroupType').value;
      if (this.statisticsType[first].key === GraphTypeName.HOURS_STATISTICS ||
          this.statisticsType[first].key !== GraphTypeName.COVERAGE_STATISTICS &&
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
      // 当选择组件通过所有验证器时向上级组件传递合法的数据
      if (val === 'VALID') {
        const selectedGraphValues = this.selectedGraph.value;
        const graphTypeName = this.statisticsType[selectedGraphValues
          .selectedStatisticsType].name;
        const isCoverageGraph = this.isCoverageGraph;
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
        selectedDepartment: [this.departmentsList[0]],
        selectedProgram: [this.programs[0]]
        }, { validator: timeValidator });
      this.departmentService.getTopDepartments()
          .subscribe(departments => {
            this.cachedDepartmentsList = this.cachedDepartmentsList.concat(departments);
            this.departmentsList = this.cachedDepartmentsList;
            this.selectedGraph.patchValue({
              selectedDepartment: this.departmentsList[0]
            });
          });
      this.canvasService.getCanvasOptions()
          .subscribe(options => this.statisticsType = options);
      this.SelectedParamChangingCheck();
  }
}
