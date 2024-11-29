import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastHistoryViewComponent } from './broadcast-history-view.component';

describe('BroadcastHistoryViewComponent', () => {
  let component: BroadcastHistoryViewComponent;
  let fixture: ComponentFixture<BroadcastHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BroadcastHistoryViewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
