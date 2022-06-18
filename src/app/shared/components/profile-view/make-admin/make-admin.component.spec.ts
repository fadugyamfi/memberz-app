import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAdminComponent } from './make-admin.component';

describe('MakeAdminComponent', () => {
  let component: MakeAdminComponent;
  let fixture: ComponentFixture<MakeAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
