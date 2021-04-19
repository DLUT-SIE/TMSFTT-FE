import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LogPerformService } from 'src/app/shared/services/data/log-perform.service';
import { LogData } from 'src/app/shared/interfaces/log';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';

@Component({
  selector: 'app-log-perform',
  templateUrl: './log-perform.component.html',
  styleUrls: ['./log-perform.component.css']
})
export class LogPerformComponent extends  GenericListComponent<LogData> {
  filterForm = this.fb.group({
    logNum: 100,
  });

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly fb: FormBuilder,
    private readonly logPerformService: LogPerformService,
  ) {
    super(route, router, location);
  }

  getResults() {
    const value = this.filterForm.value;
    const params = new Map<string, number>([
      ['n_line', value.logNum],
    ]);
    return this.logPerformService.getLogs({extraParams: params});
  }
}
