import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OptionType } from 'src/app/shared/interfaces/option-type';
import { CanvasData } from 'src/app/shared/interfaces/canvas_data';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private cachedOptions: OptionType[] = [];

  constructor(
    protected readonly http: HttpClient,
  ) { }

  getCanvasOptions() {
    if (this.cachedOptions.length !== 0) {
      return observableOf(this.cachedOptions);
    }
    return this.http.get<OptionType[]>('/aggregate-data/canvas-options/').pipe(
      tap(data => this.cachedOptions = data),
    );
  }

  getCanvasData(options: DataGraphConfiguration) {
    const url = '/aggregate-data/data/';
    const methodName = (this.cachedOptions[
      options.selectedStatisticsType].key).toLowerCase();
    const groupBy = options.selectedGroupType;
    const startYear = options.selectedStartYear;
    const endYear = options.selectedEndYear;
    const region = options.selectedDepartment;
    return this.http.get<CanvasData>(url +
      `?method_name=${methodName}&group_by=${groupBy}&start_year=` +
      `${startYear}&end_year=${endYear}&region=${region}`);
  }
}
