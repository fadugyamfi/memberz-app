import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsMessengerComponent } from './sms-messenger.component';

describe('SmsMessengerComponent', () => {
  let component: SmsMessengerComponent;
  let fixture: ComponentFixture<SmsMessengerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [SmsMessengerComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
