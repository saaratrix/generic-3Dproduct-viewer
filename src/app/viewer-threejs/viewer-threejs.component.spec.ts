import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewerThreejsComponent } from "./viewer-threejs.component";

describe("ViewerThreejsComponent", () => {
  let component: ViewerThreejsComponent;
  let fixture: ComponentFixture<ViewerThreejsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerThreejsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerThreejsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
