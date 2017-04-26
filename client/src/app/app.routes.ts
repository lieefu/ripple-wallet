import { RouterModule } from '@angular/router';
import { CreatewalletComponent} from './createwallet/createwallet.component';
import { BrainwalletComponent}   from './brainwallet/brainwallet.component';
import { PrivatewalletComponent} from './privatewallet/privatewallet.component';

export const appRoutes = [
  {
    path: 'createwallet',
    component: CreatewalletComponent
  }, {
    path: 'brainwallet',
    component: BrainwalletComponent
  }, {
    path: 'privatekeywallet',
    component: PrivatewalletComponent
  }
];
