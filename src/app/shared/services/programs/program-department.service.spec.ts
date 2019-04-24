import { TestBed } from '@angular/core/testing';

import { ProgramDepartmentService } from './program-department.service';

describe('ProgramDepartmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramDepartmentService = TestBed.get(ProgramDepartmentService);
    expect(service).toBeTruthy();
  });
});
