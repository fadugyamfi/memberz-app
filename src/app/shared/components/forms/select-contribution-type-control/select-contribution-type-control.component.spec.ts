import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContributionTypeControlComponent } from './select-contribution-type-control.component';

describe('SelectContributionTypeControlComponent', () => {
  let component: SelectContributionTypeControlComponent;
  let fixture: ComponentFixture<SelectContributionTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SelectContributionTypeControlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContributionTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
