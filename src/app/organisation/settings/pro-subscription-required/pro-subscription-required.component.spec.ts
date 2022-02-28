import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSubscriptionRequiredComponent } from './pro-subscription-required.component';

describe('ProSubscriptionRequiredComponent', () => {
  let component: ProSubscriptionRequiredComponent;
  let fixture: ComponentFixture<ProSubscriptionRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProSubscriptionRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSubscriptionRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
