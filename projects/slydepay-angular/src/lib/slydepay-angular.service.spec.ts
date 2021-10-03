import { TestBed } from '@angular/core/testing';

import { SlydepayAngularService } from './slydepay-angular.service';

describe('SlydepayAngularService', () => {
  let service: SlydepayAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlydepayAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
