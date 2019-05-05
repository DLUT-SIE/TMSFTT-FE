import { TestBed } from '@angular/core/testing';

import { APIHostInterceptor } from './apihost-interceptor.interceptor';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from 'src/environments/environment';


/* tslint:disable:no-any */
describe('APIHostInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const interceptor: APIHostInterceptor = TestBed.get(APIHostInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should intercept relative urls', () => {
    const interceptor: APIHostInterceptor = TestBed.get(APIHostInterceptor);
    const request = new HttpRequest('GET', '/relative/a');
    const handle = jasmine.createSpy();
    interceptor.intercept(request, {handle} as HttpHandler);

    expect(handle).toHaveBeenCalled();
    expect(handle.calls.count()).toEqual(1);
    expect((handle.calls.argsFor(0)[0] as HttpRequest<any>).url).toEqual(
      `${environment.API_URL}${request.url}`
    );
  });

  it('should skip absolute urls', () => {
    const interceptor: APIHostInterceptor = TestBed.get(APIHostInterceptor);
    const request = new HttpRequest('GET', 'https://a.com/relative/a');
    const handle = jasmine.createSpy();
    interceptor.intercept(request, {handle} as HttpHandler);

    expect(handle).toHaveBeenCalled();
    expect(handle.calls.count()).toEqual(1);
    expect((handle.calls.argsFor(0)[0] as HttpRequest<any>).url).toEqual(
      request.url
    );
  });
});
