import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHeaderComponent } from './print-header.component';

describe('PrintHeaderComponent', () => {
  let component: PrintHeaderComponent;
  let fixture: ComponentFixture<PrintHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PrintHeaderComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
