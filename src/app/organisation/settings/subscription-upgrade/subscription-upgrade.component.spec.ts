import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUpgradeComponent } from './subscription-upgrade.component';

describe('SubscriptionUpgradeComponent', () => {
  let component: SubscriptionUpgradeComponent;
  let fixture: ComponentFixture<SubscriptionUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
