import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductViewerComponent } from './product-viewer.component';

describe('ProductViewerComponent', () => {
  let component: ProductViewerComponent;
  let fixture: ComponentFixture<ProductViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
