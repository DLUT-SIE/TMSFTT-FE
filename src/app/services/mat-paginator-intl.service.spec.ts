import { TestBed } from '@angular/core/testing';

import { MatPaginatorIntlService } from './mat-paginator-intl.service';

describe('PaginatorIntlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatPaginatorIntlService = TestBed.get(MatPaginatorIntlService);
    expect(service).toBeTruthy();
  });
});
