import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceCategoryBreakdownComponent } from './finance-category-breakdown.component';

describe('FinanceCategoryBreakdownComponent', () => {
  let component: FinanceCategoryBreakdownComponent;
  let fixture: ComponentFixture<FinanceCategoryBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FinanceCategoryBreakdownComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceCategoryBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
