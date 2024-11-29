import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMonthControlComponent } from './select-month-control.component';

describe('SelectMonthControlComponent', () => {
  let component: SelectMonthControlComponent;
  let fixture: ComponentFixture<SelectMonthControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SelectMonthControlComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMonthControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
