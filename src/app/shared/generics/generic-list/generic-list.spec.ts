import { of as observableOf, Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListComponent } from './generic-list';
import { PaginatedResponse } from 'src/app/shared/interfaces/paginated-response';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MatPaginatorModule } from '@angular/material';

@Component({
    selector: 'app-list-component',
    template: '<mat-paginator></mat-paginator>',
})
class ListComponent extends GenericListComponent<{id: number}> {
    constructor(
        protected readonly route: ActivatedRoute,
        protected readonly router: Router,
        protected readonly location: Location,
    ) {
        super(route, router, location);
    }

    getResults(offset: number, limit: number) {
        return observableOf({} as PaginatedResponse<{id: number}>);
    }
}

describe('GenericListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let navigate: jasmine.Spy;
    let getResults: jasmine.Spy;
    let getResults$: Subject<PaginatedResponse<{id: number}>>;
    let go: jasmine.Spy;
    const dummyResponse = { id: 1 };

    beforeEach(() => {
        go = jasmine.createSpy(),
            navigate = jasmine.createSpy();
        getResults$ = new Subject();
        TestBed.configureTestingModule({
            declarations: [
                ListComponent,
            ],
            imports: [
                MatPaginatorModule,
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: () => '1',
                            },
                        }
                    },
                },
                {
                    provide: Router,
                    useValue: {
                        navigate,
                        createUrlTree: () => 'abc',
                    },
                },
                {
                    provide: Location,
                    useValue: {
                        go,
                    },
                },
                {
                    provide: HAMMER_LOADER,
                    useValue: () => new Promise(() => { }),
                },
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        getResults = spyOn(component, 'getResults');
        getResults.and.returnValue(getResults$);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load data', () => {
        const results = [dummyResponse, dummyResponse, dummyResponse];
        getResults$.next({
            results,
            count: 100,
            previous: '',
            next: ''
        });

        expect(component.isLoadingResults).toBeFalsy();
        expect(component.results).toEqual(results);
        expect(component.resultsLength).toEqual(100);
    });

    it('should empty data if an error encountered.', () => {
        getResults$.error('abc');

        expect(component.isLoadingResults).toBeFalsy();
        expect(component.results).toEqual([]);
        expect(component.resultsLength).toEqual(0);
    });

    it('should navigate to detail', () => {
        component.navigateToDetail({ id: 1 });

        expect(navigate).toHaveBeenCalled();
    });

    it('should trigger refresh (at first page)', () => {
        const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
        const firstPage = spyOn(component.paginator, 'firstPage');
        hasPreviousPage.and.returnValue(true);
        component.forceRefresh();

        expect(hasPreviousPage).toHaveBeenCalled();
        expect(firstPage).toHaveBeenCalled();
    });

    it('should trigger refresh (not at first page)', () => {
        const hasPreviousPage = spyOn(component.paginator, 'hasPreviousPage');
        const firstPage = spyOn(component.paginator, 'firstPage');
        hasPreviousPage.and.returnValue(false);
        component.forceRefresh();

        expect(hasPreviousPage).toHaveBeenCalled();
        expect(firstPage).not.toHaveBeenCalled();
        expect(go).toHaveBeenCalled();
        expect(getResults).toHaveBeenCalled();
    });

});
