import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastListPreviewComponent } from './broadcast-list-preview.component';

describe('BroadcastListPreviewComponent', () => {
  let component: BroadcastListPreviewComponent;
  let fixture: ComponentFixture<BroadcastListPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BroadcastListPreviewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastListPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
