import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {appRoutes} from './app.routes';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GlobalVariable } from './global-variable';
import {RippleService} from './ripple.service';
import { AppComponent } from './app.component';
import { NewwalletComponent } from './newwallet/newwallet.component';
import { BrainwalletComponent } from './brainwallet/brainwallet.component';
import { SeedwalletCompoent } from './seedwallet/seedwallet.component';
import { EncryptwalletComponent } from './encryptwallet/encryptwallet.component';
import { WalletComponent } from './wallet/wallet.component';
import { CreatewalletComponent } from './createwallet/createwallet.component';
import { WalletinfoComponent } from './walletinfo/walletinfo.component';
import { DecryptwalletComponent } from './decryptwallet/decryptwallet.component';

@NgModule({
  declarations: [
    AppComponent,
    NewwalletComponent,
    BrainwalletComponent,
    SeedwalletCompoent,
    EncryptwalletComponent,
    WalletComponent,
    CreatewalletComponent,
    WalletinfoComponent,
    DecryptwalletComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    FormsModule,
    HttpModule
  ],
  providers: [RippleService,GlobalVariable],
  bootstrap: [AppComponent]
})
export class AppModule { }
