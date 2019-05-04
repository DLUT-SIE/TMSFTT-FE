import { OnInit, Component } from '@angular/core';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/shared/services/window.service';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
    selector: 'app-table-export',
    templateUrl: './table-export.component.html',
    styleUrls: ['./table-export.component.css'],
})
export class TableExportComponent implements OnInit {
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
                this.snackBar.open(error.statusText, '关闭');
            });
    }
}
