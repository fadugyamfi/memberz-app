import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastListsComponent } from './broadcast-lists.component';

describe('BroadcastListsComponent', () => {
  let component: BroadcastListsComponent;
  let fixture: ComponentFixture<BroadcastListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
