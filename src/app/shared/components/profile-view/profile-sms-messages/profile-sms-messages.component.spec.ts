import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSmsMessagesComponent } from './profile-sms-messages.component';

describe('ProfileSmsMessagesComponent', () => {
  let component: ProfileSmsMessagesComponent;
  let fixture: ComponentFixture<ProfileSmsMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileSmsMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSmsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
