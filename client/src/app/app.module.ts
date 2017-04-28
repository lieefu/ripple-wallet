import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {appRoutes} from './app.routes';
import { GlobalVariable } from './global-variable';
import {RippleService} from './ripple.service';
import { AppComponent } from './app.component';
import { CreatewalletComponent } from './createwallet/createwallet.component';
import { BrainwalletComponent } from './brainwallet/brainwallet.component';
import { SeedwalletCompoent } from './seedwallet/seedwallet.component';
import { EncryptwalletComponent } from './encryptwallet/encryptwallet.component';
import { WalletComponent } from './wallet/wallet.component';

@NgModule({
  declarations: [
    AppComponent,
    CreatewalletComponent,
    BrainwalletComponent,
    SeedwalletCompoent,
    EncryptwalletComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule
  ],
  providers: [RippleService,GlobalVariable],
  bootstrap: [AppComponent]
})
export class AppModule { }
