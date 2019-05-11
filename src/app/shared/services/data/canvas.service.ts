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
    const resourceURL = 'aggregate-data/data';
    const params = new Map();
    params.set('method_name', (this.cachedOptions[
      options.selectedStatisticsType].key).toLowerCase() || '');
    params.set('group_by', options.selectedGroupType || 0);
    params.set('start_year', options.selectedStartYear || 2016);
    params.set('end_year', options.selectedEndYear || 2016);
    params.set('region', options.selectedDepartment || 0);
    const queryParams = Array.from(params.keys()).sort().map(
        key => key + '=' + encodeURIComponent(params.get(key).toString())).join('&');
    const url = `/${resourceURL}/?${queryParams}`;
    return this.http.get<CanvasData>(url);
  }
}
