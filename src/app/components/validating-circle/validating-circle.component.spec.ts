import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatingCircleComponent } from './validating-circle.component';

describe('ValidatingCircleComponent', () => {
  let component: ValidatingCircleComponent;
  let fixture: ComponentFixture<ValidatingCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatingCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatingCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
