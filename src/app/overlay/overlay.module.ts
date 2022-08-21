import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveOverlayItemsComponent } from './active-overlay-items/active-overlay-items.component';


@NgModule({
  declarations: [
    ActiveOverlayItemsComponent,
  ],
  exports: [
    ActiveOverlayItemsComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class OverlayModule { }
