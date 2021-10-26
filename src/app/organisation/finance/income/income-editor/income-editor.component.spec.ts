import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeEditorComponent } from './income-editor.component';

describe('IncomeEditorComponent', () => {
  let component: IncomeEditorComponent;
  let fixture: ComponentFixture<IncomeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
