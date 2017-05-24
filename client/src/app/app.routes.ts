import { RouterModule } from '@angular/router';
import { WalletComponent} from './wallet/wallet.component';
import { WalletinfoComponent} from './walletinfo/walletinfo.component';
import { CreatewalletComponent} from './createwallet/createwallet.component';
import { NewwalletComponent} from './newwallet/newwallet.component';
import { BrainwalletComponent}   from './brainwallet/brainwallet.component';
import { SeedwalletCompoent} from './seedwallet/seedwallet.component';
import { EncryptwalletComponent} from './encryptwallet/encryptwallet.component';
import { DecryptwalletComponent} from './decryptwallet/decryptwallet.component';
import { BalanceComponent } from './walletinfo/balance/balance.component';
import { HistoryComponent } from './walletinfo/history/history.component';
import { ContactsComponent } from './walletinfo/contacts/contacts.component';
import { TrustlinesComponent} from './trustlines/trustlines.component';
import { SendComponent} from './send/send.component';
import { WithdrawComponent} from './withdraw/withdraw.component';
import { DepositComponent} from './deposit/deposit.component';
import { TradeComponent} from './trade/trade.component';
export const appRoutes = [
    {
        path:'',
        redirectTo: 'wallet',
        pathMatch: 'full'
    },{
        path:'wallet',
        component:WalletComponent
    },{
        path:'send',
        component:SendComponent
    },{
        path:'withdraw',
        component:WithdrawComponent
    },{
        path:'deposit',
        component:DepositComponent
    },{
        path:'trade',
        component:TradeComponent
    },{
        path:'walletinfo',
        component:WalletinfoComponent,
        children:[
            {
                path:'',
                redirectTo: 'balance',
                pathMatch: 'full'
            },{
                path:'balance',
                component:BalanceComponent
            },{
                path:'history',
                component:HistoryComponent
            },{
                path:'contacts',
                component:ContactsComponent
            }
        ]
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
    },{
        path:'trustlines',
        component: TrustlinesComponent
    }

];
