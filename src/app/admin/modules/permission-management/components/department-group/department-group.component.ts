import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/group';
import { Department } from 'src/app/shared/interfaces/department';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';

@Component({
  selector: 'app-department-group',
  templateUrl: './department-group.component.html',
  styleUrls: ['./department-group.component.css']
})
export class DepartmentGroupComponent implements OnInit, OnChanges {

  @Input() departmentSelected: Department = null;
  departmentGroup: Group[] = [];

  constructor(
    private readonly groupService: GroupService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.departmentSelected) {
    this.groupService.getGroupByDepartmentName(
      this.departmentSelected.name).subscribe(
        (groups: Group[]) => this.departmentGroup = groups);
    }
  }

}
