import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import { OptionType } from 'src/app/shared/interfaces/option-type';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';
import { StatisticsType } from 'src/app/shared/enums/statistics-type.enum';
import { StaffGroupingType } from 'src/app/shared/enums/staff-grouping-type.enum';
import { TraineeNumberCoverageGroupingType } from 'src/app/shared/enums/trainee-number-coverage-grouping-type.enum';
import { TrainingHoursWorkloadGroupingType } from 'src/app/shared/enums/training-hours-workload-grouping-type.enum';

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

  selectedGraphValues: DataGraphConfiguration = null;
  selectedGraph: FormGroup;
  showDepartmentSelector = true;
  yearList: number[] = [];

  // TODO(wangyang): create a service to archieve department data from the backend.
  departmentsList: string[] = ['全校', '创新创业学院', '电信学部', '机械学部', '管经学部'];
  readonly statisticsType: OptionType[] = [
    {type: StatisticsType.STAFF_STATISTICS , name: '教职工人数统计'},
    {type: StatisticsType.TRAINEE_STATISTICS, name: '培训人数统计'},
    {type: StatisticsType.FULL_TIME_TEACHER_TRAINED_COVERAGE, name: '专任教师培训覆盖率统计'},
    {type: StatisticsType.TRAINING_HOURS_WORKLOAD_STATISTICS, name: '培训学时与工作量统计'}
  ];
  readonly staffGroupingType: OptionType[] = [
    {type: StaffGroupingType.BY_DEPARTMENT, name: '按学院'},
    {type: StaffGroupingType.BY_STAFF_TYPE, name: '按人员类别'},
    {type: StaffGroupingType.BY_STAFF_TITLE, name: '按职称'},
    {type: StaffGroupingType.BY_HIGHEST_DEGREE, name: '按最高学位'},
    {type: StaffGroupingType.BY_AGE_DISTRIBUTION, name: '按年龄分布'}
  ];
  readonly traineeNumberCoverageGroupingType: OptionType[] = [
    {type: TraineeNumberCoverageGroupingType.BY_DEPARTMENT, name: '按学院'},
    {type: TraineeNumberCoverageGroupingType.BY_STAFF_TITLE, name: '按职称'},
    {type: TraineeNumberCoverageGroupingType.BY_AGE_DISTRIBUTION, name: '按年龄分布'}
  ];
  readonly trainingHoursWorkloadGroupingType: OptionType[] = [
    {type: TrainingHoursWorkloadGroupingType.BY_TOTAL_STAFF_NUM, name: '按总人数'},
    {type: TrainingHoursWorkloadGroupingType.BY_TOTAL_TRAINING_HOURS, name: '按总培训学时'},
    {type: TrainingHoursWorkloadGroupingType.BY_PER_CAPITA_TRAINING_HOURS, name: '按人均培训学时'},
    {type: TrainingHoursWorkloadGroupingType.BY_TOTAL_WORKLOAD, name: '按总工作量'},
    {type: TrainingHoursWorkloadGroupingType.BY_PER_CAPITA_WORKLOAD, name: '按人均工作量'}
  ];
  secondType = [
    this.staffGroupingType,
    this.traineeNumberCoverageGroupingType,
    this.traineeNumberCoverageGroupingType,
    this.trainingHoursWorkloadGroupingType
  ];

  /* istanbul ignore next */
  get graphTypeName() {
    return this.selectedGraphValues === null ? '' : this.statisticsType[this.selectedGraphValues.selectedStatisticsType].name;
  }

  SelectedParamChangingCheck() {
    this.selectedGraph.get('selectedStatisticsType').valueChanges.subscribe(val => {
        this.showDepartmentSelector = val === StatisticsType.TRAINING_HOURS_WORKLOAD_STATISTICS ? false : true;
        this.selectedGraph.patchValue({selectedGroupType: null, selectedDepartment: '全校'});
    });
    this.selectedGraph.get('selectedGroupType').valueChanges.subscribe(val => {
      if (val === null) {
        return;
      }
      if (this.selectedGraph.get('selectedStatisticsType').value === StatisticsType.TRAINING_HOURS_WORKLOAD_STATISTICS ||
          val === StaffGroupingType.BY_DEPARTMENT ||
          val === TraineeNumberCoverageGroupingType.BY_DEPARTMENT) {
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
      for (let i = 2014; i <= (new Date()).getFullYear(); i++) {
          this.yearList.push(i);
      }
      this.selectedGraph = this.fb.group({
        selectedStatisticsType: [null, Validators.required],
        selectedGroupType: [null, Validators.required],
        selectedStartYear: [this.yearList[this.yearList.length - 1], Validators.required],
        selectedEndYear: [this.yearList[this.yearList.length - 1], Validators.required],
        selectedDepartment: ['全校']
        }, { validator: timeValidator });
      this.SelectedParamChangingCheck();
  }
}
