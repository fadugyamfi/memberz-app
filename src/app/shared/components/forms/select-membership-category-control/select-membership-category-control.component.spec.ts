import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMembershipCategoryControlComponent } from './select-membership-category-control.component';

describe('SelectMembershipCategoryControlComponent', () => {
  let component: SelectMembershipCategoryControlComponent;
  let fixture: ComponentFixture<SelectMembershipCategoryControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SelectMembershipCategoryControlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMembershipCategoryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
