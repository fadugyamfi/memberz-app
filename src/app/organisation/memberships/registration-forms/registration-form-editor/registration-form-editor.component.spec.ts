import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFormEditorComponent } from './registration-form-editor.component';

describe('RegistrationFormEditorComponent', () => {
  let component: RegistrationFormEditorComponent;
  let fixture: ComponentFixture<RegistrationFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RegistrationFormEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
