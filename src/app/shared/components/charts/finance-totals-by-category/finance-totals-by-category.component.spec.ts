import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTotalsByCategoryComponent } from './finance-totals-by-category.component';

describe('FinanceTotalsByCategoryComponent', () => {
  let component: FinanceTotalsByCategoryComponent;
  let fixture: ComponentFixture<FinanceTotalsByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FinanceTotalsByCategoryComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTotalsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
