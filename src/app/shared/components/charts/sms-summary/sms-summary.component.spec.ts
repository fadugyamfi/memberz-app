import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSummaryComponent } from './sms-summary.component';

describe('SmsSummaryComponent', () => {
  let component: SmsSummaryComponent;
  let fixture: ComponentFixture<SmsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
