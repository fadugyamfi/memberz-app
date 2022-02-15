import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUsePolicyComponent } from './data-use-policy.component';

describe('DataUsePolicyComponent', () => {
  let component: DataUsePolicyComponent;
  let fixture: ComponentFixture<DataUsePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataUsePolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUsePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
