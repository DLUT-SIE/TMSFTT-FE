import { Directive, Input } from '@angular/core';

/* tslint:disable:directive-class-suffix */
/* tslint:disable:directive-selector */
@Directive({
  selector: '<app-department-group-permission>',
})
export class AppDepartmentGroupPermissionStub {
  @Input() group: Group;
}

// Dummy module to satisfy Angular Language service. Never used.
import { NgModule } from '@angular/core';
import { Group } from 'src/app/shared/interfaces/group';

@NgModule({
  declarations: [
    AppDepartmentGroupPermissionStub,
  ]
})
export class AppDepartmentGroupPermissionStubModule {}
