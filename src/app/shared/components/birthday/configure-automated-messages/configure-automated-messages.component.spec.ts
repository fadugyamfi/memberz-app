import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureAutomatedMessagesComponent } from './configure-automated-messages.component';

describe('ConfigureAutomatedMessagesComponent', () => {
  let component: ConfigureAutomatedMessagesComponent;
  let fixture: ComponentFixture<ConfigureAutomatedMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ConfigureAutomatedMessagesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureAutomatedMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
