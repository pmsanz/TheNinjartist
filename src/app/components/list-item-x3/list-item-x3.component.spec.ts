import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemX3Component } from './list-item-x3.component';

describe('ListItemX3Component', () => {
  let component: ListItemX3Component;
  let fixture: ComponentFixture<ListItemX3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListItemX3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemX3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
