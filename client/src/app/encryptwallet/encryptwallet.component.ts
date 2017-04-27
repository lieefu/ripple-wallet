import { Component, OnInit } from '@angular/core';
import {RippleService} from '../ripple.service';
@Component({
    selector: 'app-encryptwallet',
    templateUrl: './encryptwallet.component.html',
    styleUrls: ['./encryptwallet.component.css']
})
export class EncryptwalletComponent implements OnInit {

    constructor(private ripple: RippleService) { }

    ngOnInit() {
    }
    encryptWallet(){
        this.ripple.encryptWallet("rGDdK8amK9atSp5DwBXRvSuk8RnCbE1pb9","net369").subscribe(console.log);
    }
}
