import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { PaginatedResponse } from '../interfaces/paginated-response';

/** This service manage User objects. */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  getUserById(id: number) {
    return this.http.get<User>(`/users/${id}/`);
  }

  getUserByUsername(username: string) {
    return this.http.get<PaginatedResponse<User>>(`/users/?username=${username}`);
  }
}
