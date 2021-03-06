import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { OptionType } from 'src/app/shared/interfaces/option-type';
import { CanvasData } from 'src/app/shared/interfaces/canvas-data';
import { ProgramsOption } from 'src/app/shared/interfaces/programs-option';
import { DataGraphConfiguration } from 'src/app/shared/interfaces/data-graph-configuration';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  private cachedOptions: OptionType[] = [];
  readonly datePipe: DatePipe = new DatePipe('zh-Hans');
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
    const startTime = options.startTime || new Date('2016-01-01');
    const endTime = options.endTime || new Date();

    params.set('method_name', (this.cachedOptions[
      options.selectedStatisticsType].key).toLowerCase() || '');
    params.set('group_by', options.selectedGroupType || 0);
    params.set('start_time', this.datePipe.transform(startTime, 'yyy-MM-dd'));
    params.set('end_time', this.datePipe.transform(endTime, 'yyy-MM-dd'));
    params.set('department_id', options.selectedDepartment.id || 0);
    if (options.selectedProgram) {
      params.set('program_id', options.selectedProgram.id);
    } else {
      params.set('program_id', 0);
    }
    const queryParams = Array.from(params.keys()).sort().map(
        key => key + '=' + encodeURIComponent(params.get(key).toString())).join('&');
    const url = `/${resourceURL}/?${queryParams}`;
    return this.http.get<CanvasData>(url);
  }
  getGroupPrograms() {
    return this.http.get<ProgramsOption[]>('/programs/group-programs/');
  }
}
