import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBirthdaysComponent } from './view-birthdays.component';

describe('ViewBirthdaysComponent', () => {
  let component: ViewBirthdaysComponent;
  let fixture: ComponentFixture<ViewBirthdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ViewBirthdaysComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBirthdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
