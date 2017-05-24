import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
    tipinfo: string;
    tipinfo_path: string;
    recipient_label: string;
    federation_json;
    extra_fields:Array<Object>=[];
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
    }
    resolveRecipient(){
        console.log(this.recipient_label);
        let destination = this.recipient_label.substring(0,this.recipient_label.indexOf("@"));
        let gateway_name = this.recipient_label.substring(this.recipient_label.indexOf("@")+1,this.recipient_label.indexOf("."));
        if(!destination || !gateway_name){
            console.log("提现地址错误");
            return;
        }
        console.log(destination,gateway_name);

        let gateway=this.ripple.gateways[gateway_name];
        if(!gateway){
            console.log("不支持此网关");
            return;
        }
        let data ={
            destination:destination
        };
        this.ripple.bridge(gateway,"federation",data).subscribe(result =>{
            console.log(result);
            if(result.federation_json){
                this.federation_json=result.federation_json;
                this.extra_fields =  this.federation_json.extra_fields ;
                console.log(this.federation_json);
            }else{
                this.extra_fields=[];
                console.log("提现地址错误");
            }
        })
    }
    send(){
        console.log(this.extra_fields);
    }
}
