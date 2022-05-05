import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUpdatePanelComponent } from './image-update-panel.component';

describe('ImageUpdatePanelComponent', () => {
  let component: ImageUpdatePanelComponent;
  let fixture: ComponentFixture<ImageUpdatePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageUpdatePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUpdatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
