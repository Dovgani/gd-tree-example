import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdTreeWrapperComponent } from './gd-tree-wrapper.component';

describe('GdTreeWrapperComponent', () => {
  let component: GdTreeWrapperComponent;
  let fixture: ComponentFixture<GdTreeWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdTreeWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdTreeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
