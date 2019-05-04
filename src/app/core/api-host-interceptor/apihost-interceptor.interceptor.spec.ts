import { TestBed } from '@angular/core/testing';

import { APIHostInterceptor } from './apihost-interceptor.interceptor';

describe('APIHostInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: APIHostInterceptor = TestBed.get(APIHostInterceptor);
    expect(service).toBeTruthy();
  });
});
