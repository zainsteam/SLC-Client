import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
// import { BLE } from '@ionic-native/ble/ngx';
import { FormsModule } from '@angular/forms';
import { DeviceModalComponent } from './device-modal/device-modal.component';
import { DBService } from './db.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@NgModule({
  declarations: [AppComponent, DeviceModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [BLE, SQLite, DBService,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
            ],
  bootstrap: [AppComponent],
})
export class AppModule {}
