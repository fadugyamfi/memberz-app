import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberControlComponent } from './member-control.component';

describe('MemberControlComponent', () => {
  let component: MemberControlComponent;
  let fixture: ComponentFixture<MemberControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
