import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BleListPage } from './ble-list.page';

const routes: Routes = [
  {
    path: '',
    component: BleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BleListPageRoutingModule {}
