import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should get user by id', () => {
    const service: UserService = TestBed.get(UserService);
    const id = 1;

    service.getUserById(id).subscribe(() => {});

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/users/${id}/`);

    expect(req.request.method).toEqual('GET');
    req.flush({});
  });

  it('should get user by username', () => {
    const service: UserService = TestBed.get(UserService);
    const username = 'abc';

    service.getUserByUsername(username).subscribe(() => {});

    const req = httpTestingController.expectOne(
      `${environment.API_URL}/users/?username=${username}`);

    expect(req.request.method).toEqual('GET');
    req.flush({});
  });
});
