import { TestBed } from '@angular/core/testing';

import { SlydepayService } from './slydepay.service';

describe('SlydepayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlydepayService = TestBed.inject(SlydepayService);
    expect(service).toBeTruthy();
  });
});
