import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaymentComponent } from './invoice-payment.component';

describe('SubscriptionPaymentComponent', () => {
  let component: InvoicePaymentComponent;
  let fixture: ComponentFixture<InvoicePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [InvoicePaymentComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
