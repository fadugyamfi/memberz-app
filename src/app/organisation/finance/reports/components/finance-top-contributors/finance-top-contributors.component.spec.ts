import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTopContributorsComponent } from './finance-top-contributors.component';

describe('FinanceTopContributorsComponent', () => {
  let component: FinanceTopContributorsComponent;
  let fixture: ComponentFixture<FinanceTopContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceTopContributorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceTopContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
