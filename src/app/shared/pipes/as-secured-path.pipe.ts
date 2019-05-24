import { Pipe, PipeTransform } from '@angular/core';
import { SecuredPath } from '../interfaces/record-attachment';

/* tslint:disable:no-any */
@Pipe({
  name: 'asSecuredPath'
})
export class AsSecuredPathPipe implements PipeTransform {

  transform(value: any, args?: any): SecuredPath {
    return value;
  }

}
