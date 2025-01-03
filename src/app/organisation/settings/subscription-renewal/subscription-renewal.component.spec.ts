import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRenewalComponent } from './subscription-renewal.component';

describe('SubscriptionRenewalComponent', () => {
  let component: SubscriptionRenewalComponent;
  let fixture: ComponentFixture<SubscriptionRenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [SubscriptionRenewalComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
