import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, length?: number): string {
    if (value === null || !length || value.length <= length) {
      return value;
    }
    return value.slice(0, length) + '..';
  }

}
