import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/shared/interfaces/group';
import { Department } from 'src/app/shared/interfaces/department';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-department-group',
  templateUrl: './department-group.component.html',
  styleUrls: ['./department-group.component.css']
})
export class DepartmentGroupComponent implements OnInit {

  private _departmentChange = new Subject();
  departmentSelectedItem: Department = null;
  departmentGroup: Group[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly groupService: GroupService,
    private readonly router: Router,
  ) { }

  @Input()
  set departmentSelected(department: Department) {
    this.departmentSelectedItem = department;
    this._departmentChange.next();
  }

  ngOnInit() {
    this._departmentChange.pipe(
      switchMap(() => {
        return this.groupService.getGroupsByTopDepartmentId(
          this.departmentSelectedItem.id);
      }),
    ).subscribe(res => {
      this.departmentGroup = res;
    });
  }

  /** Navigate to detail page which is related to current route. */
  navigateToDetail(row: Group) {
    this.router.navigate(['../groups', row.id], { relativeTo: this.route });
  }
}
