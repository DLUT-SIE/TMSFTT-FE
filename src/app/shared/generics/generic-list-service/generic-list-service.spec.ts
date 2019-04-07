import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericListService } from './generic-list-service';
import { environment } from 'src/environments/environment';
import { ListRequest } from 'src/app/shared/interfaces/list-request';

@Injectable({
    providedIn: 'root'
})
class ListService extends GenericListService {
    constructor(
        protected readonly http: HttpClient,
    ) {
        super(http);
    }

    getObjects(url: string, req: ListRequest) {
        return this.list<{}>(url, req);
    }
}

describe('GenericListService', () => {
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

    it('should create', () => {
        const service: ListService = TestBed.get(ListService);
        expect(service).toBeDefined();
    });

    it('should strip prefix and suffix slashes', () => {
        const service: ListService = TestBed.get(ListService);
        const url = 'abc';
        service.getObjects(`/${url}/`, {}).subscribe();

        const expectedUrl = `${environment.API_URL}/${url}/?limit=${environment.PAGINATION_SIZE}&offset=0`;

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
    });

    it('should construct request with extra params', () => {
        const service: ListService = TestBed.get(ListService);
        const url = 'abc';
        const extraParams = new Map<string, {}>([['name', 'def']]);
        service.getObjects(`/${url}/`, { extraParams }).subscribe();

        const expectedUrl = `${environment.API_URL}/${url}/?limit=${environment.PAGINATION_SIZE}&name=def&offset=0`;

        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toBe('GET');
    });
});
