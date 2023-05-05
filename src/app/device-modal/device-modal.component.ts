import { Component, OnInit, NgZone  } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';
import { DBService } from '../db.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.scss'],
})
export class DeviceModalComponent  implements OnInit {

  // categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  ble_device1:any=[];

  name:string="";
  mac:string="";
  type:string="";
  constructor(private modalCtrl: ModalController,
    public database : DBService,
    private ble: BLE,
    private ngZone: NgZone,
    public navParams: NavParams,
    private router: Router,
    public navCtrl: NavController) {
      this.ble_device1 = navParams.get("ble_device");
      if (this.ble_device1.name != undefined){
      this.name=this.ble_device1.name;
      }
      else{
        this.name == "";
      }
      // this.name=this.ble_device1.name;
      this.mac= this.ble_device1.id;
      this.setStatus('Connecting to ' + this.name + this.mac);
   }
  connectionState: boolean = false;
  connectionStateLabel: string = "Connected";
  buttonFill: string = "solid";
  connectionColor: string = "success";
  peripheral: any = {};
  statusMessage: string = "";


  // name: string = "new device";
  ngOnInit() {
    // console.log("name" , this.name)
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log("Confirmed Clicked")
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  isDisconnected() {
    if (this.connectionState == true) {
      console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.mac).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
      this.onDeviceDisconnected();
    } else {
      this.ble.connect(this.mac).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected()
      );
    
    }

    
  }
  onDeviceDisconnected(){
    this.connectionState = false;
      this.buttonFill = "solid";
      this.connectionStateLabel = "Connected";
      this.connectionColor = "success";

  }
  onConnected(peripheral : any){
    console.log("connected", peripheral)
    this.connectionState = true;
    this.buttonFill = "outline";
    this.connectionStateLabel = "Disconnected";
    this.connectionColor = "tertiary";
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });

  }

  setStatus(message : any) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  
  addCategory() {
    console.log(this.type)
    if (!this.name.length) {
      alert("Enter category name");
      
      return;
    }

    if (this.editMode) {
      console.log(this.name);
      // edit category
      this.database
        .editCategory(this.name, this.editId)
        .then((data) => {
          this.name = "";
          (this.editMode = false), (this.editId = 0);
          alert(data);
          this.getCategories();
        });
    } else {
      // add category
      this.database.addCategory(this.name,this.ble_device1, this.type)
      .then((data) => {
        // this.name = "";
        alert(data);
        if (data == "Device Created"){
        this.getCategories();
        this.modalCtrl.dismiss(this.ble_device1, 'cancel');
        this.router.navigate(['home']);
        } 
      })
      .catch((e) => {
        console.log(e)
      })
      
    }
  }

 async getCategories() {
    await this.database.getCategories().then((data) => {
      console.log(data)
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
    console.log(this.categories);
  }


}
