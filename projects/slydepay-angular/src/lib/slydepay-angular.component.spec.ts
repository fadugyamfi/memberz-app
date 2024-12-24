import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlydepayAngularComponent } from './slydepay-angular.component';

describe('SlydepayAngularComponent', () => {
  let component: SlydepayAngularComponent;
  let fixture: ComponentFixture<SlydepayAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SlydepayAngularComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlydepayAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
