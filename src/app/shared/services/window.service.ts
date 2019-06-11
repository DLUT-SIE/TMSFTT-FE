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

  /* istanbul ignore next */
  open(url: string) {
    window.open(url);
  }

  /* istanbul ignore next */
  getComputedStyle(elt: Element) {
    return window.getComputedStyle(elt);
  }

  /** Get the native window object. */
  get nativeWindow() {
    return window;
  }

  get host() {
    let hostUrl: string;
    hostUrl = window.location.protocol + '//' + window.location.hostname;
    if (window.location.port) {
      hostUrl += ':' + window.location.port;
    }
    return hostUrl;
  }
}
