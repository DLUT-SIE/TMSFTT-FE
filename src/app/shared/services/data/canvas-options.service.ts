import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OptionType } from 'src/app/shared/interfaces/option-type';

@Injectable({
  providedIn: 'root'
})
export class CanvasOptionsService {

  private cachedOptions: OptionType[] = [];

  constructor(
    protected readonly http: HttpClient,
  ) { }

  getCanvasOptions() {
    if (this.cachedOptions.length !== 0) {
      return observableOf(this.cachedOptions);
    }
    return this.http.get<OptionType[]>('/canvas-data/canvas-options/').pipe(
      tap(data => this.cachedOptions = data),
    );
  }
}
