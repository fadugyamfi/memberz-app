import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFormsComponent } from './registration-forms.component';

describe('RegistrationFormsComponent', () => {
  let component: RegistrationFormsComponent;
  let fixture: ComponentFixture<RegistrationFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RegistrationFormsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
