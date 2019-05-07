import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CampusEvent } from 'src/app/shared/interfaces/event';
import { DomSanitizer } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs/operators';
import { ProgramService } from 'src/app/shared/services/programs/program.service';
import { DepartmentService } from 'src/app/shared/services/department.service';


@Component({
  selector: 'app-campus-event-detail',
  templateUrl: './campus-event-detail.component.html',
  styleUrls: ['./campus-event-detail.component.css']
})
export class CampusEventDetailComponent implements OnInit {

  item: CampusEvent;
  department: string;
  category: string;
  programName: string;
  isLoadDate = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    private readonly programService: ProgramService,
    private readonly departmentService: DepartmentService,
    readonly location: Location,
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

  get description() {
    // Through this getter, we can bypass sanitizing and get raw HTML.
    return this.sanitizer.bypassSecurityTrustHtml(this.item.description || /* istanbul ignore next */ '');
  }

}
