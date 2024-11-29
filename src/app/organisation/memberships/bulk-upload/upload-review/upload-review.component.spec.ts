import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadReviewComponent } from './upload-review.component';

describe('UploadReviewComponent', () => {
  let component: UploadReviewComponent;
  let fixture: ComponentFixture<UploadReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UploadReviewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
