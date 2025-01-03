import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldComponent } from './custom-field.component';

describe('CustomFieldComponent', () => {
  let component: CustomFieldComponent;
  let fixture: ComponentFixture<CustomFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CustomFieldComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
