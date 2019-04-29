import { OnInit, Component } from '@angular/core';
import { TableExportService } from 'src/app/shared/services/data/table-export.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from 'src/app/shared/services/window.service';

@Component({
    selector: 'app-table-export',
    templateUrl: './table-export.component.html',
    styleUrls: ['./table-export.component.css'],
})
export class TableExportComponent implements OnInit {
    constructor(
        private readonly tableExportService: TableExportService,
        private readonly snackBar: MatSnackBar,
        private readonly windowService: WindowService) {

    }

    ngOnInit() {
    }

    doTableExport() {
        const url = `${environment.API_URL}/data-management/table-export`;
        this.tableExportService.exportTable(url).subscribe(
            data => {
                const path = `${environment.HOST}${data['url']}`;
                this.windowService.nativeWindow.open(path);
                this.snackBar.open('导出成功', '确定', {duration: 3000});
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                this.snackBar.open(error.statusText, '关闭');
            });
    }
}
