import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptionType } from 'src/app/shared/interfaces/option-type';

@Injectable({
  providedIn: 'root'
})
export class CanvasOptionsService {

  constructor(
    protected readonly http: HttpClient,
  ) { }

  getCanvasOptions() {
    return this.http.get<OptionType[]>('/canvas-data/canvas-options/');
  }
}
