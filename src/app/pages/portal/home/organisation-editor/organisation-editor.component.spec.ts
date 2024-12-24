import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationEditorComponent } from './organisation-editor.component';

describe('OrganisationEditorComponent', () => {
  let component: OrganisationEditorComponent;
  let fixture: ComponentFixture<OrganisationEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [OrganisationEditorComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
