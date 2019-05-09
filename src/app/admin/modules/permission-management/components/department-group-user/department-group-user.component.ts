import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { User } from 'src/app/shared/interfaces/user';
import { Group } from 'src/app/shared/interfaces/group';
import { GenericListComponent } from 'src/app/shared/generics/generic-list/generic-list';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { AdduserDialogComponent } from '../adduser-dialog/adduser-dialog.component';

@Component({
  selector: 'app-department-group-user',
  templateUrl: './department-group-user.component.html',
  styleUrls: ['./department-group-user.component.css']
})
export class DepartmentGroupUserComponent extends GenericListComponent<User> {

  @Input() group: Group;
  username: string;

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

  openDialog() {
    const dialogRef = this.dialog.open(AdduserDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.groupService.addUserGroup(result, this.group.id).subscribe(
        () => this.forceRefresh());
    });
  }

}
