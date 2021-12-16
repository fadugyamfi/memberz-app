import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwofaEnableComponent } from './twofa-enable.component';

describe('TwofaEnableComponent', () => {
  let component: TwofaEnableComponent;
  let fixture: ComponentFixture<TwofaEnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwofaEnableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwofaEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
