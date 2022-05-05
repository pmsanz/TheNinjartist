import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportListPanelComponent } from './import-list-panel.component';

describe('ImportListPanelComponent', () => {
  let component: ImportListPanelComponent;
  let fixture: ComponentFixture<ImportListPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportListPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportListPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
