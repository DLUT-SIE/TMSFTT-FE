import { TestBed } from '@angular/core/testing';

import { MatPaginatorIntlService } from './mat-paginator-intl.service';

describe('PaginatorIntlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatPaginatorIntlService = TestBed.get(MatPaginatorIntlService);
    expect(service).toBeTruthy();
  });

  it('should return range label', () => {
    const service: MatPaginatorIntlService = TestBed.get(MatPaginatorIntlService);
    const page = 2;
    const pageSize = 10;
    const length = 50;
    const startRecord = page * pageSize + 1;
    const endRecord = (page + 1) * pageSize + 1;
    const expectedLabel = `${length} 条结果中的第 ${startRecord} - ${endRecord} 条结果`;

    const label = service.getRangeLabel(page, pageSize, length);

    expect(label).toBe(expectedLabel);
  });
});
