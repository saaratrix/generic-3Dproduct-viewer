import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import type { ModuleWithProviders } from "@angular/core";
import { AppComponent } from "./app.component";
import { ViewerThreejsComponent } from "./viewer-threejs/viewer-threejs.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { ToolbarProductItemComponent } from "./toolbar/toolbar-product-item/toolbar-product-item.component";
import { ToolbarInstructionsComponent } from "./toolbar/toolbar-instructions/toolbar-instructions.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { ToolbarSubitemComponent } from "./toolbar/toolbar-subitem/toolbar-subitem.component";
import { ToolbarSubitemContainerComponent } from "./toolbar/toolbar-subitem-container/toolbar-subitem-container.component";
import { RouterModule } from "@angular/router";
import { ProductViewerComponent } from "./product-viewer/product-viewer.component";
import { productViewerPageMatcher } from "./product-viewer/product-viewer-page-matcher";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SidebarFreeColorComponent } from "./sidebar/sidebar-free-color/sidebar-free-color.component";
import { SidebarSpecificColorComponent } from "./sidebar/sidebar-specific-color/sidebar-specific-color.component";
import { SidebarSpecificTextureComponent } from "./sidebar/sidebar-specific-texture/sidebar-specific-texture.component";

const rootRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot([
  { component: ProductViewerComponent, matcher: productViewerPageMatcher },
]);

@NgModule({
  declarations: [
    AppComponent,
    ViewerThreejsComponent,
    ToolbarComponent,
    ToolbarProductItemComponent,
    ToolbarInstructionsComponent,
    LoadingSpinnerComponent,
    ToolbarSubitemComponent,
    ToolbarSubitemContainerComponent,
    ProductViewerComponent,
    SidebarComponent,
    SidebarFreeColorComponent,
    SidebarSpecificColorComponent,
    SidebarSpecificTextureComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    rootRouting,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
