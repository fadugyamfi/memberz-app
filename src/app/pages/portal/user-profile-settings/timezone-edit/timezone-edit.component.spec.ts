import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneEditComponent } from './timezone-edit.component';

describe('TimezoneEditComponent', () => {
  let component: TimezoneEditComponent;
  let fixture: ComponentFixture<TimezoneEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TimezoneEditComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
