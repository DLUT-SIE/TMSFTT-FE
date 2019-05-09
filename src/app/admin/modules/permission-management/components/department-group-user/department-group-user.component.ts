import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-department-group-user',
  templateUrl: './department-group-user.component.html',
  styleUrls: ['./department-group-user.component.css']
})
export class DepartmentGroupUserComponent implements OnInit {

  @Input() groupId;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly location: Location,
    private readonly groupService: GroupService,
    public dialog: MatDialog,
  ) {
    super(route, router, location);
  }

  getResults(offset: number, limit: number) {
    const extraParams = new Map();
    extraParams.set('group', this.group.id);
    return this.groupService.getUsersByGroupId({offset, limit, extraParams});
  }

  onGroupRemove(id: number) {
    return this.groupService.removeUserByUserGroupId(id).subscribe(
      () => this.forceRefresh());
  }

  ngOnInit() {
  }

}
