import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ProgramService } from './program.service';
import { Program } from 'src/app/shared/interfaces/program';

@Injectable({
  providedIn: 'root'
})
export class ProgramDetailResolverService implements Resolve<Program> {

  constructor(
    private readonly programService: ProgramService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Program> {
    const id = +route.paramMap.get('id');
    return this.programService.getProgram(id);
  }
}
