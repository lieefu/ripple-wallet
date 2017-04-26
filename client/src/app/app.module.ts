import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {appRoutes} from './app.routes';
import {RippleService} from './ripple.service';
import { AppComponent } from './app.component';
import { CreatewalletComponent } from './createwallet/createwallet.component';
import { BrainwalletComponent } from './brainwallet/brainwallet.component';
import { PrivatewalletComponent } from './privatewallet/privatewallet.component';
import { EncryptwalletComponent } from './encryptwallet/encryptwallet.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatewalletComponent,
    BrainwalletComponent,
    PrivatewalletComponent,
    EncryptwalletComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule
  ],
  providers: [RippleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
