import { Component, NgZone } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DBService } from '../db.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  constructor(
    public router: Router,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    public database: DBService) {
    
  }

  ngOnInit() {
    // console.log("name" , this.name)
    // this.getCategories();
    this.database.createDatabase().then(() => {
      // will call get categories
      this.getCategories();
    });
  }

  ionViewDidEnter(){
    this.getCategories();

  }

 async getCategories() {
   await this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
    console.log(this.categories)
  }

}
