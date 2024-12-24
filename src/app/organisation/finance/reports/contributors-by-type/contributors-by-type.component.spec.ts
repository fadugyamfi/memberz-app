import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsByTypeComponent } from './contributors-by-type.component';

describe('ContributorsByTypeComponent', () => {
  let component: ContributorsByTypeComponent;
  let fixture: ComponentFixture<ContributorsByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContributorsByTypeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContributorsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
