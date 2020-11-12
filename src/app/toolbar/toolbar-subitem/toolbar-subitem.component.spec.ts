import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarSubitemComponent } from './toolbar-subitem.component';

describe('ToolbarSubitemComponent', () => {
  let component: ToolbarSubitemComponent;
  let fixture: ComponentFixture<ToolbarSubitemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarSubitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarSubitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
