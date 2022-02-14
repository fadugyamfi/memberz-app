import { TestBed } from '@angular/core/testing';

import { OrganisationPublicPageGuard } from './organisation-public-page.guard';

describe('OrganisationPublicPageGuard', () => {
  let guard: OrganisationPublicPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OrganisationPublicPageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
