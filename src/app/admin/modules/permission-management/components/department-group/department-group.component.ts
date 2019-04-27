import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/group';
import { Department } from 'src/app/shared/interfaces/department';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';

@Component({
  selector: 'app-department-group',
  templateUrl: './department-group.component.html',
  styleUrls: ['./department-group.component.css']
})
export class DepartmentGroupComponent implements OnInit {

  @Input() departmentSelected: Department = null;
  departmentGroup: Group[] = [];

  constructor(
    private readonly groupService: GroupService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['departmentSelected'].currentValue){
    this.groupService.getGroupByDepartmentName(
      changes['departmentSelected'].currentValue.name).subscribe(
        (groups: Group[]) => this.departmentGroup = groups)};
  }

}
