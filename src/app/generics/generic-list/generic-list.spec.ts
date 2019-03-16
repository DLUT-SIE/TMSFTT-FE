import { of as observableOf, Subject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericListComponent } from './generic-list';
import { PaginatedResponse } from 'src/app/interfaces/paginated-response';
import { GenericObject } from 'src/app/interfaces/generics';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material';
import { Component } from '@angular/core';
import { HAMMER_LOADER } from '@angular/platform-browser';

@Component({
    selector: 'app-list-component',
    template: '<mat-paginator></mat-paginator>',
})
class ListComponent extends GenericListComponent<GenericObject> {
    constructor(
        protected readonly route: ActivatedRoute,
        protected readonly router: Router,
    ) {
        super(route, router);
    }

    getResults(offset: number, limit: number) {
        return observableOf({} as PaginatedResponse<GenericObject>);
    }
}

describe('GenericListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let navigate: jasmine.Spy;
    let getResults: jasmine.Spy;
    let getResults$: Subject<PaginatedResponse<GenericObject>>;
    const dummyResponse = { id: 1 };

    beforeEach(() => {
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
                    useValue: {},
                },
                {
                    provide: Router,
                    useValue: {
                        navigate,
                    }
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

        expect(navigate).toHaveBeenCalledWith(
            ['.', 1], { relativeTo: {} });
    });
});
