import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, SimpleChange } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Sim } from '@ionic-native/sim';
import { Device } from '@ionic-native/device';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    UniqueDeviceID,
    Sim,
    StatusBar,
    Device,
    Uid,
    AndroidPermissions,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
