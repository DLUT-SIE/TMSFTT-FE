import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { of as observalbeOf, throwError } from 'rxjs';

import { UploadAdapter } from './upload-adapter';

describe('UploadAdapter', () => {
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
    const loader = jasmine.createSpy();
    const adapter: UploadAdapter = new UploadAdapter(loader, TestBed.get(HttpClient));
    expect(adapter).toBeTruthy();
  });

  it('should return url if succeed', () => {
    const file = new Promise(resolve => resolve(new File(['abccc'], 'file')));
    const loader = {file, uploaded: 0, uploadTotal: 0};
    /* tslint:disable-next-line:no-any */
    const adapter: UploadAdapter = new UploadAdapter(loader, {} as any);
    spyOn(adapter, 'uploadFile').and.returnValue(observalbeOf({url: 'abc'}));
    adapter.upload().then((val: {url: string}) => expect(val.url).toEqual('abc'));
  });

  it('should reject on error', () => {
    const file = new Promise(resolve => resolve(new File(['abccc'], 'file')));
    const loader = {file, uploaded: 0, uploadTotal: 0};
    /* tslint:disable-next-line:no-any */
    const adapter: UploadAdapter = new UploadAdapter(loader, {} as any);
    spyOn(adapter, 'uploadFile').and.returnValue(throwError('Error'));
    adapter.upload().then(
      (val: {url: string}) => expect(val.url).toEqual('abc'),
      (reason: string) => expect(reason).toEqual('Error'));
  });

  it('should reject if cancelled', () => {
    const file = new Promise(resolve => resolve(new File(['abccc'], 'file')));
    const loader = {file, uploaded: 0, uploadTotal: 0};
    /* tslint:disable-next-line:no-any */
    const adapter: UploadAdapter = new UploadAdapter(loader, {} as any);
    spyOn(adapter, 'uploadFile').and.returnValue(observalbeOf(undefined));
    adapter.upload().then(
      (val: {url: string}) => expect(val.url).toEqual('abc'),
      (reason: string) => expect(reason).toEqual('文件上传已取消!'));
  });

  it('should upload file and return url', () => {
    const loader = {uploaded: 0, uploadTotal: 0};
    const adapter: UploadAdapter = new UploadAdapter(loader, TestBed.get(HttpClient));

    adapter.uploadFile(new File(['abc'], 'file')).subscribe(
      (resp: {default: string}) => {
        expect(resp.default).toBe('/url/to/file');
      },
    );

    const req = httpTestingController.expectOne('/insecure-files/');
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBeTruthy();
    req.event({type: HttpEventType.UploadProgress, loaded: 100, total: 1000});
    expect(loader.uploaded).toBe(100);
    expect(loader.uploadTotal).toBe(1000);
    req.flush({url: '/url/to/file'});
  });

  it('should upload file and report error', () => {
    const loader = {uploaded: 0, uploadTotal: 0};
    const adapter: UploadAdapter = new UploadAdapter(loader, TestBed.get(HttpClient));

    adapter.uploadFile(new File(['abc'], 'file')).subscribe(
      (resp: {default: string}) => {
        expect(resp.default).toBe('/url/to/file');
      },
      (err: string) => {
        expect(err).toBe('Error');
      }
    );

    const req = httpTestingController.expectOne('/insecure-files/');
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBeTruthy();
    req.flush({detail: 'Error'}, {status: 400, statusText: 'abc'});
  });

  it('should upload file and report raw error', () => {
    const loader = {uploaded: 0, uploadTotal: 0};
    const adapter: UploadAdapter = new UploadAdapter(loader, TestBed.get(HttpClient));

    adapter.uploadFile(new File(['abc'], 'file')).subscribe(
      (resp: {default: string}) => {
        expect(resp.default).toBe('/url/to/file');
      },
      (err: string) => {
        expect(err).toBe('Http failure response for /insecure-files/: 400 Error');
      }
    );

    const req = httpTestingController.expectOne('/insecure-files/');
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBeTruthy();
    req.flush(null, {status: 400, statusText: 'Error'});
  });

  it('should abort uploading process', () => {
    const adapter: UploadAdapter = new UploadAdapter({}, TestBed.get(HttpClient));

    adapter.uploadFile(new File(['abc'], 'file')).subscribe();
    adapter.abort();

    const req = httpTestingController.expectOne('/insecure-files/');
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBeTruthy();
    expect(req.cancelled).toBeTruthy();
  });
});
