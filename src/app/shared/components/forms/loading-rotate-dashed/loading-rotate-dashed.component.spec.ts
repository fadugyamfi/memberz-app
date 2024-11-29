import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingRotateDashedComponent } from './loading-rotate-dashed.component';

describe('LoadingRotateDashedComponent', () => {
  let component: LoadingRotateDashedComponent;
  let fixture: ComponentFixture<LoadingRotateDashedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LoadingRotateDashedComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingRotateDashedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
