import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LightControllerPage } from './light-controller.page';

const routes: Routes = [
  {
    path: '',
    component: LightControllerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LightControllerPageRoutingModule {}
