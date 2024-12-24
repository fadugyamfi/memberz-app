import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberEditorComponent } from './family-member-editor.component';

describe('FamilyMemberEditorComponent', () => {
  let component: FamilyMemberEditorComponent;
  let fixture: ComponentFixture<FamilyMemberEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FamilyMemberEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMemberEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
