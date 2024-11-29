import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlatformsComponent } from './payment-platforms.component';

describe('PaymentPlatformsComponent', () => {
  let component: PaymentPlatformsComponent;
  let fixture: ComponentFixture<PaymentPlatformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [PaymentPlatformsComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
