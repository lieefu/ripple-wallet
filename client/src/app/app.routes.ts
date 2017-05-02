import { RouterModule } from '@angular/router';
import { WalletComponent} from './wallet/wallet.component';
import { WalletinfoComponent} from './walletinfo/walletinfo.component';
import { CreatewalletComponent} from './createwallet/createwallet.component';
import { NewwalletComponent} from './newwallet/newwallet.component';
import { BrainwalletComponent}   from './brainwallet/brainwallet.component';
import { SeedwalletCompoent} from './seedwallet/seedwallet.component';
import { EncryptwalletComponent} from './encryptwallet/encryptwallet.component';
import { DecryptwalletComponent} from './decryptwallet/decryptwallet.component';

export const appRoutes = [
    {
        path:'',
        redirectTo: 'wallet',
        pathMatch: 'full'
    },{
        path:'wallet',
        component:WalletComponent
    },{
        path:'walletinfo',
        component:WalletinfoComponent
    },{
        path:'decryptwallet',
        component:DecryptwalletComponent
    },{
        path:'createwallet',
        component:CreatewalletComponent,
        children:[
            {
              path: 'newwallet',
              component: NewwalletComponent,
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
