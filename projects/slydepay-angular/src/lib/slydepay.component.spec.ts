import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlydepayComponent } from './slydepay.component';

describe('SlydepayComponent', () => {
  let component: SlydepayComponent;
  let fixture: ComponentFixture<SlydepayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [SlydepayComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlydepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
