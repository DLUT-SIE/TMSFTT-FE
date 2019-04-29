import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TableExportService {
    constructor(private readonly http: HttpClient) {
    }

    exportTable(url: string) {
        return this.http.get(url);
    }

}