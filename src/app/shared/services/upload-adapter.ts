import { from as observableFrom, throwError, Subject } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { map, last, switchMap, catchError, takeUntil } from 'rxjs/operators';

/* This is mainly for CKEditor to handle image upload events. */
/* tslint:disable:no-any */
export class UploadAdapter {

  loader: any;
  private readonly requestAbort = new Subject<void>();

  constructor(
    loader: any,
    private readonly http: HttpClient,
  ) {
    // The file loader instance to use during the upload.
    this.loader = loader;
  }

  uploadFile(file: File) {
    const data = new FormData();
    data.set('upload', file, file.name);
    const req = new HttpRequest('POST', '/insecure-files/', data, {
      reportProgress: true
    });
    return this.http.request(req).pipe(
      takeUntil(this.requestAbort),
      map((event: HttpEvent<{}>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.loader.uploaded = event.loaded;
            this.loader.uploadTotal = event.total;
            break;
          case HttpEventType.Response:
            return { default: (event.body as { url: string }).url };
          default:
            break;
        }
      }),
      last(),
      catchError((err: HttpErrorResponse) => {
        if (err.error) {
          return throwError(err.error.detail);
        }
        return throwError(err.message);
      }),
    );
  }

  // Starts the upload process.
  upload() {
    return new Promise((resolve, reject) => {
      observableFrom(this.loader.file).pipe(
        switchMap((file: File) => this.uploadFile(file)),
      ).subscribe(
        res => {
          if (!res) {
            reject('文件上传已取消!');
            return;
          }
          resolve(res);
        },
        err => reject(err),
      );
    });
  }

  abort() {
    this.requestAbort.next();
  }
}
