import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarInstructionsComponent } from './toolbar-instructions.component';

describe('ToolbarInstructionsComponent', () => {
  let component: ToolbarInstructionsComponent;
  let fixture: ComponentFixture<ToolbarInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
