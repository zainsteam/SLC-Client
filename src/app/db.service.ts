import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
// import { strict } from "assert";

@Injectable({
  providedIn: 'root'
})

export class DBService {

  databaseObj!: SQLiteObject;
  tables = {
    categories: "Devices",
  };

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: "SLC",
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      })
      .catch((e) => {
        alert("error on creating database " + JSON.stringify(e));
      });

    await this.createTables();
  }

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.categories} (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE, mac VARCHAR(255) NOT NULL UNIQUE, type VARCHAR(255), prevcolor VARCHAR(255), uName VARCHAR(255), UUID VARCHAR(255))`,
      []
    );

  }

  async addCategory(name: string, device : any, type: string) {
    console.log(name);
    let data = [name, device.id, type]
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.categories} (name,mac, type) VALUES (?,?,?)`,
        data
      )
      .then(() => {   
        return "Device Created";
      })
      .catch((e) => {
        if (e.code === 6) {
          return "device already exists";
        }

        return "error on creating device " + JSON.stringify(e);
      });
  }

  async getCategories() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.categories} ORDER BY name ASC`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        return "error on getting device " + JSON.stringify(e);
      });
  }

  async deleteCategory(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.categories} WHERE id = ${id}`, [])
      .then(() => {
        return "Device deleted";
      })
      .catch((e) => {
        return "error on deleting Device " + JSON.stringify(e);
      });
  }

  async editCategory(name: string, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.categories} SET name = '${name}' WHERE id = ${id}`,
        []
      )
      .then(() => {
        return "Device Updated";
      })
      .catch((e) => {
        if (e.code === 6) {
          return "Device already exist";
        }

        return "error on updating Device " + JSON.stringify(e);
      });
  }

}
