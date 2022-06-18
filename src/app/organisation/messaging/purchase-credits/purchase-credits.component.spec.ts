import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCreditsComponent } from './purchase-credits.component';

describe('PurchaseCreditsComponent', () => {
  let component: PurchaseCreditsComponent;
  let fixture: ComponentFixture<PurchaseCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
