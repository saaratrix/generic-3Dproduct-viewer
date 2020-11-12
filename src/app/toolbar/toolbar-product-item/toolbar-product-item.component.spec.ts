import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolbarProductItemComponent } from './toolbar-product-item.component';

describe('ToolbarProductItemComponent', () => {
  let component: ToolbarProductItemComponent;
  let fixture: ComponentFixture<ToolbarProductItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarProductItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
