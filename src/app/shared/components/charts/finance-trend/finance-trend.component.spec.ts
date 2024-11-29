import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTrendComponent } from './finance-trend.component';

describe('FinanceTrendComponent', () => {
  let component: FinanceTrendComponent;
  let fixture: ComponentFixture<FinanceTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FinanceTrendComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
