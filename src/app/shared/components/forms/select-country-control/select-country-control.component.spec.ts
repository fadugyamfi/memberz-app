import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCountryControlComponent } from './select-country-control.component';

describe('SelectCountryControlComponent', () => {
  let component: SelectCountryControlComponent;
  let fixture: ComponentFixture<SelectCountryControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCountryControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCountryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
