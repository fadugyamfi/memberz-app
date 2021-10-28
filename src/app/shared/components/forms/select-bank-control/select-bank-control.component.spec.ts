import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBankControlComponent } from './select-bank-control.component';

describe('SelectBankControlComponent', () => {
  let component: SelectBankControlComponent;
  let fixture: ComponentFixture<SelectBankControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBankControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBankControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
