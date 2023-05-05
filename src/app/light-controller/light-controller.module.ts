import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LightControllerPageRoutingModule } from './light-controller-routing.module';

import { LightControllerPage } from './light-controller.page';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LightControllerPageRoutingModule,
    ColorPickerModule  
  ],
  declarations: [LightControllerPage]
})
export class LightControllerPageModule {}
