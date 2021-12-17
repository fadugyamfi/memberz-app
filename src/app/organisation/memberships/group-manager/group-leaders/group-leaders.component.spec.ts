import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLeadersComponent } from './group-leaders.component';

describe('GroupLeadersComponent', () => {
  let component: GroupLeadersComponent;
  let fixture: ComponentFixture<GroupLeadersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupLeadersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
