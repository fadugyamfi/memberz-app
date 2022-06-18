import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTemplateTagControlComponent } from './sms-template-tag-control.component';

describe('SmsTemplateTagControlComponent', () => {
  let component: SmsTemplateTagControlComponent;
  let fixture: ComponentFixture<SmsTemplateTagControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsTemplateTagControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTemplateTagControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
