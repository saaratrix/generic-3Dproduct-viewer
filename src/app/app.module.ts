import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ViewerThreejsComponent } from "./viewer-threejs/viewer-threejs.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ToolbarProductItemComponent } from "./toolbar/toolbar-product-item/toolbar-product-item.component";

@NgModule({
  declarations: [
    AppComponent,
    ViewerThreejsComponent,
    ToolbarComponent,
    ToolbarProductItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
