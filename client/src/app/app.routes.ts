import { RouterModule } from '@angular/router';
import { WalletComponent} from './wallet/wallet.component';
import { CreatewalletComponent} from './createwallet/createwallet.component';
import { BrainwalletComponent}   from './brainwallet/brainwallet.component';
import { SeedwalletCompoent} from './seedwallet/seedwallet.component';
import {EncryptwalletComponent} from './encryptwallet/encryptwallet.component';

export const appRoutes = [
    {
        path:'wallet',
        component:WalletComponent,
        children:[
            {
              path: 'createwallet',
              component: CreatewalletComponent,
              children: [
                { path: 'encryptwallet', component: EncryptwalletComponent }
              ]
            }, {
              path: 'brainwallet',
              component: BrainwalletComponent,
              children: [
                { path: 'encryptwallet', component: EncryptwalletComponent }
              ]
            }, {
              path: 'seedwallet',
              component: SeedwalletCompoent,
              children: [
                { path: 'encryptwallet', component: EncryptwalletComponent }
              ]
            }
        ]
    }

];
