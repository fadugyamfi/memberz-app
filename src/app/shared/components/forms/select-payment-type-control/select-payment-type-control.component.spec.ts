import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentTypeControlComponent } from './select-payment-type-control.component';

describe('SelectPaymentTypeControlComponent', () => {
  let component: SelectPaymentTypeControlComponent;
  let fixture: ComponentFixture<SelectPaymentTypeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPaymentTypeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaymentTypeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
