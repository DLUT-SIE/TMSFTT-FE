import { Injectable } from '@angular/core';

/** WindowService wraps window. */
@Injectable({
  providedIn: 'root'
})
export class WindowService {
  /* istanbul ignore next */
  /** Redirect browser to URL. */
  redirect(url: string) {
    window.location.href = url;
  }
}
