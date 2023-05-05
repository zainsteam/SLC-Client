import { Component, NgZone, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
// import { BLE } from '@ionic-native/ble/ngx';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { DeviceModalComponent} from '../device-modal/device-modal.component';
import { DBService } from '../db.service';

@Component({
  selector: 'app-ble-list',
  templateUrl: './ble-list.page.html',
  styleUrls: ['./ble-list.page.scss'],
})
export class BleListPage {
  categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  public name: string = '';
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log("Confirmed Clicked")
    }
  }

  connectionState: boolean = true;
  isScanning: boolean = false;
  buttonFill: string = "outline";
  connectionStateLabel: string = "Disconnected";
  connectionColor: string = "tertiary";
  scanIcon: string = "search-outline";
  scanColor: string = "primary";

  isDisconnected() {
    if (this.connectionState == true) {
      this.connectionState = false;
      this.buttonFill = "solid";
      this.connectionStateLabel = "Connected";
      this.connectionColor = "success";
    } else {
      this.connectionState = true;
      this.buttonFill = "outline";
      this.connectionStateLabel = "Disconnected";
      this.connectionColor = "tertiary";
    }

  }

  bleScan() {
    this.scanIcon = "stop-outline";
    this.scanColor = "danger";
    
    // setTimeout(this.stopScan, 1000);
  }

  stopScan() {
    this.isScanning = false;
    console.log("stop scan");
    this.scanIcon = "search-outline";
    this.scanColor = "primary";

  }

  devices: any[] = [];
  statusMessage: string='';

  constructor(
    public router: Router,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    private modalCtrl: ModalController,
    public database : DBService
  ) { }

  async openModal(id: any) {
    console.log(id)
    const modal = await this.modalCtrl.create({
      component: DeviceModalComponent,
      componentProps: { ble_device: id}
    });
    modal.present();
  }

  scan() {
    if(!this.isScanning){
      this.isScanning = true;
    this.bleScan();
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = [];  // clear list

    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    }
    else{
      this.stopScan();
    }
  }

  
  onDeviceDiscovered(device :string) {
    
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });

  }

  // If location permission is denied, you'll end up here
  async scanError(error : string) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'bottom',
      duration: 5000
    });
    (await toast).present();
  }

  setStatus(message :string) {
    console.log(message, "setsatus");
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
    setTimeout(this.stopScan.bind(this), 10000, 'Scan Stopped');
  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter');
    // this.scan();
  }



}
