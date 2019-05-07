import { TestBed } from '@angular/core/testing';

import { CanvasOptionsService } from './canvas-options.service';

describe('CanvasOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasOptionsService = TestBed.get(CanvasOptionsService);
    expect(service).toBeTruthy();
  });
});
