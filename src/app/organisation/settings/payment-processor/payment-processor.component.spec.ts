import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentProcessorComponent } from './payment-processor.component';

describe('PaymentProcessorComponent', () => {
  let component: PaymentProcessorComponent;
  let fixture: ComponentFixture<PaymentProcessorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentProcessorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
