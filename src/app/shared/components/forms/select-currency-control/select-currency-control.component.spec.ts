import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCurrencyControlComponent } from './select-currency-control.component';

describe('SelectCurrencyControlComponent', () => {
  let component: SelectCurrencyControlComponent;
  let fixture: ComponentFixture<SelectCurrencyControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCurrencyControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCurrencyControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
