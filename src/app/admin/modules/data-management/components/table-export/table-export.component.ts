import { OnInit, Component } from '@angular/core';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/shared/services/window.service';
import { LoggerService } from 'src/app/shared/services/logger.service';

interface Table {
    id: number,
    name: string
}

@Component({
    selector: 'app-table-export',
    templateUrl: './table-export.component.html',
    styleUrls: ['./table-export.component.css'],
})
export class TableExportComponent implements OnInit {
    
    readonly tables_basic: Table[] = [
        {id: 1, name: '教职工表'},
        {id: 2, name: '专任教师表'}
    ];

    readonly tables_training: Table[] = [
        {id: 3, name: '培训总体情况表'},
        {id: 4, name: '专任教师培训覆盖率表'}, 
        {id: 5, name: '培训学时与工作量表'}
    ];

    constructor(
        private readonly tableExportService: TableExportService,
        private readonly snackBar: MatSnackBar,
        private readonly windowService: WindowService,
        private readonly loggerService: LoggerService) {

    }

    ngOnInit() {
    }

    doTableExport() {
        const url = `/data-management/table-export`;
        this.tableExportService.exportTable(url).subscribe(
            data => {
                this.windowService.open(data['url']);
                this.snackBar.open('导出成功', '确定', {duration: 3000});
            },
            (error: HttpErrorResponse) => {
                this.loggerService.log(error);
                this.snackBar.open(error.error['detail'], '关闭');
            });
    }
}
