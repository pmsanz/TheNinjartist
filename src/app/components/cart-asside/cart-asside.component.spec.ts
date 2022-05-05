import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAssideComponent } from './cart-asside.component';

describe('CartAssideComponent', () => {
  let component: CartAssideComponent;
  let fixture: ComponentFixture<CartAssideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartAssideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartAssideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
