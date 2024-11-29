import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TawkChatComponent } from './tawk-chat.component';

describe('TawkChatComponent', () => {
  let component: TawkChatComponent;
  let fixture: ComponentFixture<TawkChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TawkChatComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TawkChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
