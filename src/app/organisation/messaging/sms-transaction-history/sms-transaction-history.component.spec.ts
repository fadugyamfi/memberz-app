import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTransactionHistoryComponent } from './sms-transaction-history.component';

describe('SmsTransactionHistoryComponent', () => {
  let component: SmsTransactionHistoryComponent;
  let fixture: ComponentFixture<SmsTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [SmsTransactionHistoryComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
