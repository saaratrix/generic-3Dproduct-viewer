import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ViewerThreejsComponent } from "./viewer-threejs/viewer-threejs.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ToolbarProductItemComponent } from "./toolbar/toolbar-product-item/toolbar-product-item.component";
import { ToolbarInstructionsComponent } from "./toolbar/toolbar-instructions/toolbar-instructions.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ToolbarSubitemComponent } from "./toolbar/toolbar-subitem/toolbar-subitem.component";
import { ToolbarSubitemContainerComponent } from "./toolbar/toolbar-subitem-container/toolbar-subitem-container.component";

@NgModule({
  declarations: [
    AppComponent,
    ViewerThreejsComponent,
    ToolbarComponent,
    ToolbarProductItemComponent,
    ToolbarInstructionsComponent,
    LoadingSpinnerComponent,
    ToolbarSubitemComponent,
    ToolbarSubitemContainerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
