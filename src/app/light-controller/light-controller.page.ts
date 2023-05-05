import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RangeCustomEvent } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { DBService } from '../db.service';
import { Router } from '@angular/router';
// import { stringify } from 'querystring';
import { BLE } from '@awesome-cordova-plugins/ble/ngx';


@Component({
  selector: 'app-light-controller',
  templateUrl: './light-controller.page.html',
  styleUrls: ['./light-controller.page.scss'],
})
export class LightControllerPage implements OnInit {

    public id: number = 0;
    public compareWith = '';
    public buttonFill = 'solid';
    public canDismiss = '';
    public page = '';
    public color : any ;

    public pattern:Number=0;
    // public pinFormatter= '';
    public lamp_name : string = " ";

    connectionState: boolean = false;
  connectionStateLabel: string = "";
  connectionColor: string = "success";
  peripheral: any = {};
  statusMessage: string = "";

  ble_device1:any=[];

  name:string="";
  mac : string = "";



  on :boolean = false;
  brightness!: RangeValue;
  speed !: RangeValue;
  power :string = "";
  palette: Number = 0;
  sparking: Number = 0;
  twinkleDensity: Number = 0;
  twinkleSpeed: Number = 0;

  DeviceData :any=[];

  SERVICE_UUID_ESPOTA :string = "d804b643-6ce7-4e81-9f8a-ce0f699085eb";
 CHARACTERISTIC_UUID_ID  :string = "d804b644-6ce7-4e81-9f8a-ce0f699085eb";
 
 SERVICE_UUID_OTA :string =  "c8659210-af91-4ad3-a995-a58d6fd26145"; // (Trigger OTA, Restart, Delete)
 CHARACTERISTIC_UUID_FW  :string = "c8659211-af91-4ad3-a995-a58d6fd26145";
 CHARACTERISTIC_UUID_HW_VERSION  :string = "c8659212-af91-4ad3-a995-a58d6fd26145";
 CHARACTERISTIC_UUID_CMD :string =  "c8659213-af91-4ad3-a995-a58d6fd26145";
 SERVICE_UUID_JSONDATA  :string = "591e89a2-98c7-49b3-b746-a0a8ac6c7752" ;// Rest of commands UUID
 CHARACTERISTIC_UUID_JSON_REQUEST  :string = "591e89a3-98c7-49b3-b746-a0a8ac6c7752";
 CHARACTERISTIC_UUID_JSON_RESPONSE  :string = "591e89a4-98c7-49b3-b746-a0a8ac6c7752";
  
    
  constructor(private actRoute: ActivatedRoute,
             private alertController: AlertController,
             public database : DBService,
             private ble: BLE,
             private ngZone: NgZone,
             public router : Router,
             private colorPickerModule: ColorPickerModule) {
              this.actRoute.paramMap.subscribe((params) => {
                this.id = Number(params.get('id'));
                this.lamp_name = params.get('name')!;
                this.mac = params.get('mac')!;
                });
              }


  ngOnInit() {

    // this.ble.isConnected(this.mac).then( 
    //   peripheral => console.log("connected state", peripheral),
    // peripheral => this.onConnected(peripheral)
    // )
    if(!this.connectionState){
    this.isDisconnected();
    this.DeviceData = {
      "power" : false,
      "brightness" : 0,
      "speed" : 0,
      "color" : "rgb(0,0,0)",
      "pattern" : 0,
      "palette" : 0,
      "sparking" : 0,
      "twinkleDensity" : 0,
      "twinkleSpeed" : 0,

    }
    // alert(this.DeviceData.sparkings)
    }
  }

  pinFormatterB(value: number) {
    return `${value}`;
  }

  pinFormatterS(value: number) {
    return `${value}`;
  }


    handlerMessage = '';
    roleMessage = '';
    currentPattern = undefined;
    
    async presentAlert1() {
    const alert =  await  this.alertController.create({
      header: 'Delete Device',
//      subHeader: 'You are about to delete this lamp from your device.',
      message: 'You are about to delete this device from your app. Are you sure?',
      buttons: [
          {
          text: 'DELETE',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
            this.deleteData();
          },
        },
            {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
            
          },
        },
      ],
    });

    await alert.present();
        const { role } = await alert.onDidDismiss();
    this.roleMessage = `Dismissed with role: ${role}`;
    console.log(role)
  }

  async deleteData(){
    console.log(this.id)
    await this.database.deleteCategory(this.id)
    .then((data) => {
      // this.name = "";
      alert(data);
      // this.getCategories();
      // this.modalCtrl.dismiss(this.ble_device1, 'cancel');
      this.router.navigate(['home']); 
    })
  }
    lastValue!: RangeValue;
    updatestatus:boolean=false;

    restartDevice(){
      if (this.connectionStateLabel != "Connected"){
        alert("please connect the device")
      }
      else{}
    }

    updateData(){
      if (this.connectionStateLabel != "Connected"){
        alert("please connect the device")
      }
      else{
      // this.DeviceData.color = this.color;
      // alert(this.DeviceData.color);

      this.ble.write(this.mac,this.SERVICE_UUID_JSONDATA,this.CHARACTERISTIC_UUID_JSON_REQUEST,this.DeviceData).then(
        data => {
          console.log("data get",data);
          this.updatestatus = true;
        },
        data => {
          console.log("no data",data);
          this.updatestatus = false;
        }
      )
    }
  }
    
    brightnessUpdate(ev: Event){
    this.DeviceData.brightness = (ev as RangeCustomEvent).detail.value;
    console.log(this.DeviceData.brightness);
}

    speedUpdate(ev: Event){
    this.DeviceData.speed = (ev as RangeCustomEvent).detail.value;
    // this.DeviceData.power = this.on;
    console.log(this.DeviceData);

}


    async editName(){
            const alert = await this.alertController.create({
      header: "Lamp Name",
      buttons: [
           {
          text: 'Set',
          role: 'confirm',
          handler: (alertData) => {
            this.lamp_name = alertData[0];
            this.editData();
          },
        },
      ],
      inputs: [
        {
          placeholder: 'New Name',
          value:this.lamp_name  
        },
      ],
    });

    await alert.present();
    }

     editData(){
       this.database.editCategory(this.lamp_name,this.id)
    .then((data) => {
      // this.name = "";
      alert(data);
      // this.getCategories();
      // this.modalCtrl.dismiss(this.ble_device1, 'cancel');
      this.router.navigate(['home']); 
    })
    }
  
    async presentAlertNew() {
    const alert = await this.alertController.create({
      header: 'Select your twinkle settings',
      buttons: [
           {
          text: 'Set',
          role: 'confirm',
          handler: (alertData) => {
            console.log(alertData);
            this.DeviceData.twinkleSpeed = alertData.Twinkle_Speed;
            this.DeviceData.twinkleDensity = alertData.Twinkle_Density;
            this.DeviceData.sparking = alertData.Twinkle_Sparkling;
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Twinkle Density',
          type: 'number',
          min: 1,
          value:3,
          max: 8,
          name: "Twinkle_Density",
        },
         {
          placeholder: 'Twinkle Speed',
          type: 'number',
          value:3,
          min: 1,
          max: 8,
          name: "Twinkle_Speed",          
        },
         {
          placeholder: 'Twinkle Sparkling',
          type: 'number',
          value:3,
          min: 1,
          max: 255,
          name: "Twinkle_Sparkling",      
        },
      ],
    });

    await alert.present();
  }
    
    handleChange(ev: any) {
    this.DeviceData.pattern = Number(ev.target.value);
        
        if(this.DeviceData.pattern == "2"){
            this.presentAlertNew();
        }
  }

  handleChangePLT(ev: any) {
    this.DeviceData.palette = Number(ev.target.value);
        
        
  }

  ionViewWillLeave(){
    this.connectionState = false;
    this.ble.disconnect(this.mac).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
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
      this.connectionStateLabel = "Disconnected";
      this.connectionColor = "success";
      alert("Device not connected")


  }
  onConnected(peripheral : any){
    console.log("connected", peripheral)
    this.connectionState = true;
    this.buttonFill = "outline";
    this.connectionStateLabel = "Connected";
    this.connectionColor = "tertiary";
    this.ngZone.run(() => {
      this.peripheral = peripheral;
      this.setStatus('connected now');
    });

    this.ble.read(this.mac,this.SERVICE_UUID_JSONDATA,this.CHARACTERISTIC_UUID_JSON_REQUEST).then(
      data => console.log("data get",data),
      data => console.log("no data",data)
    )

  }

  setStatus(message : any) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}
