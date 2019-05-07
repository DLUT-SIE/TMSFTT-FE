import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { DomSanitizer } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs/operators';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { DepartmentService } from 'src/app/shared/services/department.service';

@Component({
  selector: 'app-admin-campus-event-detail',
  templateUrl: './admin-campus-event-detail.component.html',
  styleUrls: ['./admin-campus-event-detail.component.css']
})
export class AdminCampusEventDetailComponent implements OnInit {

  item: CampusEvent;
  department: string;
  category: string;
  programName: string;
  isLoadDate = false;

  constructor(
    readonly location: Location,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly programService: ProgramService,
    private readonly departmentService: DepartmentService,
  ) { }

  ngOnInit() {
    this.route.data.pipe(
      switchMap(data => {
        this.item = data.item;
        return this.programService.getProgram(Number(this.item.program));
      }),
      switchMap(program => {
        this.programName = program.name;
        this.category = program.category_str;
        return  this.departmentService.getDepartment(program.department);
      }),
      map(deparment => {
        this.department = deparment.name;
        this.isLoadDate = true;
      })
    ).subscribe();
  }

  navigateToChangeEvent() {
    this.router.navigate(['/admin/events/form'], { queryParams: { event_id: this.item.id } });
  }

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.item.description || /* istanbul ignore next */ '');
  }

}
