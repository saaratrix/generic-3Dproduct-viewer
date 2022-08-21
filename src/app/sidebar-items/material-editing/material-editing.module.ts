import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialEditingFreeColorComponent } from './material-editing-free-color/material-editing-free-color.component';
import { MaterialEditingSpecificColorComponent } from './material-editing-specific-color/material-editing-specific-color.component';
import { MaterialEditingSpecificTextureComponent } from './material-editing-specific-texture/material-editing-specific-texture.component';

@NgModule({
  declarations: [
    MaterialEditingFreeColorComponent,
    MaterialEditingSpecificColorComponent,
    MaterialEditingSpecificTextureComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [],
})
export class MaterialEditingModule { }
