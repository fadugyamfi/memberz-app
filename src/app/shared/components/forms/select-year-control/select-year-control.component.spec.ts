import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectYearControlComponent } from './select-year-control.component';

describe('SelectYearControlComponent', () => {
  let component: SelectYearControlComponent;
  let fixture: ComponentFixture<SelectYearControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectYearControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectYearControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
