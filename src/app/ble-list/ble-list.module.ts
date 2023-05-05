import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleListPageRoutingModule } from './ble-list-routing.module';

import { BleListPage } from './ble-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleListPageRoutingModule
  ],
  declarations: [BleListPage]
})
export class BleListPageModule {}
