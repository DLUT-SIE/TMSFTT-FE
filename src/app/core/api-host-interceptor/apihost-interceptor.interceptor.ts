import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Add host for relative URLs, skip when URL is an absolute path. */
@Injectable({
  providedIn: 'root'
})
export class APIHostInterceptor implements HttpInterceptor {

  constructor() { }

  /* tslint:disable-next-line:no-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;
    if (url.startsWith('http')) {
      return next.handle(request);
    }
    request = request.clone({
      url: `${environment.API_URL}${url}`,
    });
    return next.handle(request);
  }
}
