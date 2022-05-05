import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUpdatePanelv2Component } from './image-update-panelv2.component';

describe('ImageUpdatePanelv2Component', () => {
  let component: ImageUpdatePanelv2Component;
  let fixture: ComponentFixture<ImageUpdatePanelv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUpdatePanelv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUpdatePanelv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
