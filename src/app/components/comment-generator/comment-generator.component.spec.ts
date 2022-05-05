import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentGeneratorComponent } from './comment-generator.component';

describe('CommentGeneratorComponent', () => {
  let component: CommentGeneratorComponent;
  let fixture: ComponentFixture<CommentGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
