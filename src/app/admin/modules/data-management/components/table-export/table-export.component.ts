import { OnInit, Component } from '@angular/core';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/shared/services/window.service';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { Department } from 'src/app/shared/interfaces/department';
import { FormGroup, FormBuilder, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { Program } from 'src/app/shared/interfaces/program';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { errorProcess } from 'src/app/shared/utils/error-process';

// Config for Various Table.
/* tslint:disable */
export class SubOptionsConfig {
    private readonly mask = 0b1000
    private readonly departmentMask = this.mask;
    private readonly programMask = this.mask >>> 1;
    private readonly startTimerMask = this.mask >>> 2;
    private readonly endTimetMask = this.mask >>> 3;

    public statusBits: number;

    constructor(statusBits: number) {
        this.statusBits = statusBits;
    }

    get departmenShow(): boolean {
        return Boolean(this.statusBits & this.departmentMask);
    }

    get programShow(): boolean {
        return Boolean((this.statusBits & this.programMask));
    }
    
    get startTimeShow(): boolean {
        return Boolean((this.statusBits & this.startTimerMask));
    }

    get endTimeShow(): boolean {
        return Boolean((this.statusBits & this.endTimetMask));
    }
}

export interface Table {
    id: number;
    name: string;
    subOptionsConfig?: number;
    validators?: ValidatorFn[];
}

export const timeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const startTime = control.get('startTime');
    const endTime = control.get('endTime');
    if (startTime.disabled && endTime.disabled) {
      return null;
    }
    return startTime.value && endTime.value && (startTime.value as Date).getTime() >= (endTime.value as Date).getTime() ?
           { timeValidator: true } : null;
};

export const programRequiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (control.get('selectedProgram').disable) {
        return null;
    }
    return control.get('selectedProgram').value == null ? {programRequiredValidator: true} : null;
};

const falseValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return { falseValidator: true};
};

@Component({
    selector: 'app-table-export',
    templateUrl: './table-export.component.html',
    styleUrls: ['./table-export.component.css'],
})
export class TableExportComponent implements OnInit {
    readonly tables: Table[] = [
        {id: 2, name: '专任教师表', subOptionsConfig: 0b1111, validators: [timeValidator]},
        {id: 3, name: '培训总体情况表', subOptionsConfig: 0b1111, validators: [timeValidator]},
        {id: 4, name: '专任教师培训覆盖率表', subOptionsConfig: 0b1111, validators: [timeValidator]},
        {id: 5, name: '培训学时与工作量表', subOptionsConfig: 0b0011, validators: [timeValidator]},
        {id: 6, name: '培训项目反馈表', subOptionsConfig: 0b1100, validators: [timeValidator, programRequiredValidator]},
        {id: 10, name: '培训活动出席表', subOptionsConfig: 0b1111, validators: [timeValidator]},
        {id: 7, name: '工作量计算表', subOptionsConfig: 0b0011, validators: [timeValidator]},
    ];

    departmentsData: Department[] = [{id: 1, name: '大连理工大学'} as Department];
    selectedDepartment: Department;

    programsList: Program[] = [
        {id: 1, name: '百师讲坛', department: 39},
        {id: 2, name: '职业生涯规划', department: 49},
        {id: 3, name: '教学观摩', department: 50},
        {id: 4, name: '实地采访', department: 51},
        {id: 5, name: '三严三实', department: 51},
    ] as Program[];

    readonly defaultProgram = {id: -1, name: '全部'} as Program;

    programsData: Program[] = this.programsList;

    exportTableOptions: FormGroup;

    choosedTable: Table;
    choosedDepartment: Department;
    choosedProgram: Program;

    subOptionsConfig = new SubOptionsConfig(0b0000);
    exportReady = false;

    queryParams = null;

    constructor(
        private fb: FormBuilder,
        private readonly tableExportService: TableExportService,
        private readonly snackBar: MatSnackBar,
        private readonly windowService: WindowService,
        private readonly loggerService: LoggerService,
        private readonly departmentService: DepartmentService,
        private readonly programService: ProgramService) {

    }

    controlNames = ['selectedTable', 'selectedDepartment', 'selectedProgram', 'startTime', 'endTime'];

    initEventListening() {
        this.exportTableOptions.get('selectedTable').valueChanges.subscribe((table: Table) => {
            // set other sub-options configure
            this.subOptionsConfig.statusBits = table.subOptionsConfig;
            this.exportTableOptions.setValidators(table.validators);
            if (this.subOptionsConfig.departmenShow) {
                this.getDepartments();
            }
            if (this.subOptionsConfig.programShow) {
                this.getPrograms();
            }
        });
        this.exportTableOptions.get('selectedDepartment').valueChanges.subscribe((department: Department) => {
            if (this.subOptionsConfig.programShow) {
                const programData = this.programsData;
                if (this.choosedDepartment.id !== 1) {
                    this.programsList = programData.filter(p => p.department === this.choosedDepartment.id);
                } else {
                    this.programsList = programData;
                }
                if (this.programsList.length === 0) {
                    this.snackBar.open(`没有对应的培训项目。`, '确定');
                    this.exportTableOptions.get('selectedDepartment').setErrors({invalid: true});
                } else {
                    this.exportTableOptions.get('selectedDepartment').setErrors(null);
                }
            }
        });
    }

    getDepartments() {
        this.departmentService.getTopDepartments()
        .subscribe(departments => this.departmentsData = this.departmentsData.concat(departments));
    }

    getPrograms() {
        // TODO
        const request = {} as ListRequest;
        this.programService.getPrograms(request)
            .subscribe((programs: Program[]) => {
                this.programsData = programs;
                this.programsList = this.programsData;
            });
    }

    ngOnInit() {
        this.exportTableOptions = this.fb.group(
            {
            selectedTable: [null, Validators.required],
            selectedProgram: [],
            startTime: [],
            endTime: [],
            selectedDepartment: [this.departmentsData[0]]
        },
        {
            validator: falseValidator
        });
        this.initEventListening();
    }

    doTableExport() {
        this.tableExportService.exportTable(this.buildUrl()).subscribe(
            data => {
                this.windowService.open(data['url']);
                this.snackBar.open('导出成功', '确定', {duration: 3000});
            },
            (error: HttpErrorResponse) => {
                this.loggerService.log(error);
                const message = errorProcess(error);
                this.snackBar.open(message, '关闭');
            });
    }

    buildUrl(): string {
        let url = `/aggregate-data/table-export/?table_type=${this.choosedTable.id}&table_name=${this.choosedTable.name}`;
        const controlValues = this.exportTableOptions.value;
        var params = '';
        if (this.subOptionsConfig.departmenShow && controlValues.selectedDepartment !== null) {
            params += `&department_id=${controlValues.selectedDepartment.id}`;
        }
        if (this.subOptionsConfig.programShow && controlValues.selectedProgram !== null) {
            if (controlValues.selectedProgram.id != -1) {
                params += `&program_id=${controlValues.selectedProgram.id}`;
            }
        }
        if (this.subOptionsConfig.startTimeShow && controlValues.startTime !== null) {
            const startDate = controlValues.startTime as Date;
            params += `&start_time=${startDate.toISOString()}`;
        }
        if (this.subOptionsConfig.endTimeShow && controlValues.endTime !== null) {
            const endDate = controlValues.endTime as Date;
            params += `&end_time=${endDate.toISOString()}`;
        }
        url += params;
        return url;
    }
}
