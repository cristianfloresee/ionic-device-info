import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Platform } from 'ionic-angular';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  UniqueDeviceID;
  Sim = {};
  device_info = {};
  uid_info = {};
  json_sim;
  json_device;

  constructor(
    public navCtrl: NavController,
    private unique_id: UniqueDeviceID,
    public platform: Platform,
    private sim: Sim,
    private device: Device,
    private uid: Uid, 
    private androidPermissions: AndroidPermissions
  ) {


  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.getUniqueDeviceID();
      this.getSimInfo();
      this.getDeviceInfo();
      let caca = this.getImei();
      console.log("caca: ", caca);
    })
  }

  getUniqueDeviceID() {
    this.unique_id.get()
      .then((uuid: any) => this.UniqueDeviceID = uuid)
      .catch((error: any) => this.UniqueDeviceID = 'error(' + error + ')');
  }

  getSimInfo() {

    if (this.platform.is('cordova')) {
      this.sim.hasReadPermission().then(
        (info) => {
          console.log('Has permission: ', info);
          this.Sim['read_permission'] = info;
        }
      );
    }
    else {
      this.Sim['read_permission'] = 'error(cordova_not_available)';
    }


    this.sim.getSimInfo().then(
      (info) => {
        this.json_sim = JSON.stringify(info);
        console.log('Sim info: ', info);
        switch (info.mcc) {
          case '730':
            this.Sim['pais'] = info.mcc + ' - Chile';
            switch (info.mnc) {
              case '01':
                this.Sim['compania'] = info.mnc + ' - Entel';
              case '02':
                this.Sim['compania'] = info.mnc + ' - Movistar';
              case '03':
                this.Sim['compania'] = info.mnc + ' - Claro';
              case '04':
                this.Sim['compania'] = info.mnc + ' - Wom';
            }
            break;
          case '716':
            this.Sim['pais'] = info.mcc + ' - Perù';
            break;
          case '736':
            this.Sim['pais'] = info.mcc + ' - Bolivia';
            break;
          default:
            this.Sim['pais'] = info.mcc + ' - Desconocido';
            break;
        }
      },
      (error) => {
        this.Sim['pais'] = 'error(' + error + ')';
        this.Sim['compania'] = 'error(' + error + ')'
        console.log('Unable to get sim inf: ', error);
      }
    );
  }

  getDeviceInfo(){
    console.log("device: ", this.device);
    this.json_device = this.device;
    this.device_info['model'] = this.device.model;
    this.device_info['platform'] = this.device.platform;
    this.device_info['uuid'] = this.device.uuid;
    this.device_info['version'] = this.device.version;
    this.device_info['manufacturer'] = this.device.manufacturer;
    this.device_info['serial'] = this.device.serial;
  }

  async getImei() {

    console.log("me meti po");

    //PERMISOS PARA LEER EL ESTADO DEL DISPOSITIVO
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
   
    console.log("hasPermission: ", hasPermission);
    if (!hasPermission) { //SI NO TENGO PERMISO
      //PIDO PERMISO
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
   
      //SI NO ME DA PERMISO
      if (!result.hasPermission) {
        throw new Error('Permissions required');
      }
   
      // ok, a user gave us permission, we can get him identifiers after restart app
      return;
    }
   
    console.log("uid: ", this.uid);
    this.uid_info['iccid']= this.uid.ICCID;
    this.uid_info['imei']= this.uid.IMEI;
    this.uid_info['imsi']= this.uid.IMSI;
    this.uid_info['mac']= this.uid.MAC;
     return this.uid.IMEI
   }

}
