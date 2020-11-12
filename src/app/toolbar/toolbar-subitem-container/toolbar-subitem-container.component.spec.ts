import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarSubitemContainerComponent } from './toolbar-subitem-container.component';

describe('ToolbarSubitemContainerComponent', () => {
  let component: ToolbarSubitemContainerComponent;
  let fixture: ComponentFixture<ToolbarSubitemContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarSubitemContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarSubitemContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
