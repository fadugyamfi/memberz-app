import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEditorComponent } from './branch-editor.component';

describe('BranchEditorComponent', () => {
  let component: BranchEditorComponent;
  let fixture: ComponentFixture<BranchEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
