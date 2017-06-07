import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable, Tipinfo } from '../global-variable';

@Component({
    selector: 'app-advanced',
    templateUrl: './advanced.component.html',
    styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {
    name:string;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.name = this.gv.wallet.name;
    }
    setWalletName(name:string){
        this.ripple.setWalletName(name).subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.gv.wallet = result.data;
            }else{
                console.log("设置钱包名字失败")
            }
        });
    }
}
