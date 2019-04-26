import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Program } from 'src/app/shared/interfaces/program';

import { GenericListService } from 'src/app/shared/generics/generic-list-service/generic-list-service';
import { DepartmentService } from 'src/app/shared/services/department.service';
import { ProgramCategoryService } from 'src/app/shared/services/programs/program-category.service';
import { ListRequest } from 'src/app/shared/interfaces/list-request';
import { Observable, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramService extends GenericListService {

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly programCategoryService: ProgramCategoryService,
    protected readonly http: HttpClient,
  ) {
      super(http);
    }

  /** get the information of programs from the background. */
  getPrograms(req: ListRequest) {
    return this.list<Program>('programs', req);
  }

  /** get the information of one program from the background. */
  getProgram(id: number) {
    return this.http.get<Program>(
      `${environment.API_URL}/programs/${id}/`);
  }

  getProgramWithDetail(id: number) {
    return this.getDetailProgram(this.getProgram(id));
  }

  private getDetailProgram(program: Observable<Program>) {
    let programWithDetail: Program;
    return program.pipe(
      switchMap((data) => {
        programWithDetail = data;
        return  zip(
          this.departmentService.getDepartment(data.department),
          this.programCategoryService.getProgramCategory(data.category)
        );
      }),
      map((data) => {
        programWithDetail.department = data[0];
        programWithDetail.category = data[1];
        return programWithDetail;
      }),
    );
  }

  /** create admin-program-form. */
  createProgram(req: Program) {
    return this.http.post<Program>(
      `${environment.API_URL}/programs/`, req);
  }
}
