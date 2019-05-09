import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/shared/interfaces/group';
import { GroupService } from 'src/app/admin/modules/permission-management/services/group.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/** Pre-fetching group data. */
@Injectable({
  providedIn: 'root'
})
export class GroupResolverService implements Resolve<Group> {

  constructor(
    private readonly groupService: GroupService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Group> {
    const id = +route.paramMap.get('id');
    return this.groupService.getGroupById(id);
  }
}
