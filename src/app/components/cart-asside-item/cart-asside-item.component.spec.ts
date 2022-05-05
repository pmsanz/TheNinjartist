import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAssideItemComponent } from './cart-asside-item.component';

describe('CartAssideItemComponent', () => {
  let component: CartAssideItemComponent;
  let fixture: ComponentFixture<CartAssideItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartAssideItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartAssideItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
