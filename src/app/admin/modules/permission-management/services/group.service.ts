import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Group } from 'src/app/shared/interfaces/group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getGroupById(id: number) {
    return this.http.get<Group>(`${environment.API_URL}/groups/${id}/`);
  }

  getGroupByDepartmentName(name: string): Observable<Group[]>{
    return this.http.get<Group[]>(
      `${environment.API_URL}/groups/?name__startswith=${name}`);
  }
}
