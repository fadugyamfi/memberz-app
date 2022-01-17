import { TestBed } from '@angular/core/testing';

import { TwoFaService } from './two-fa.service';

describe('TwoFaService', () => {
  let service: TwoFaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwoFaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
