import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFooterComponent } from './print-footer.component';

describe('PrintFooterComponent', () => {
  let component: PrintFooterComponent;
  let fixture: ComponentFixture<PrintFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
