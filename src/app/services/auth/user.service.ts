import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

/** This service manage User objects. */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getUserById(id: number) {
    return this.http.get(`${environment.API_URL}/users/${id}/`);
  }

  getUserByUsername(username: string) {
    return this.http.get(`${environment.API_URL}/users/?username=${username}`);
  }
}
