import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-send',
    templateUrl: './send.component.html',
    styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
    tipinfo: string;
    recipient_label: string;
    currency_label: string = "XRP- Ripples";
    Amount: any = {
        currency: "XRP",
        value: 0
    };
    destination_address: string;
    amount_value: number;
    currencies = [];
    isShowAmount: boolean = false;
    isShowSendXRPbtn: boolean = false;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
    }
    resolveRecipient() {
        console.log(this.recipient_label);
        this.destination_address = this.recipient_label;
        this.isShowAmount = false;
        this.ripple.getTrustlines(this.destination_address).subscribe(result => {
            if (result.ok) {
                console.log(result);
                const trustlines = result.data;
                this.currencies = [];
                for (let i = 0; i < trustlines.length; i++) {
                    const currency = {
                        name: trustlines[i].specification.currency,
                        issuer: trustlines[i].specification.counterparty
                    }
                    this.currencies.push(currency);
                }
                this.isShowAmount = true;
                console.log(this.currencies);
            } else {
                if (result.data.message == "actNotFound") {
                    this.tipinfo = "对方是未激活钱包";
                    this.currencies = [];
                    this.isShowAmount = true;
                } else {
                    this.tipinfo = "钱包地址格式错误。";
                };
            }
        });
    }
    setCurrencyLabel(currency, label) {
        console.log(currency);
        if (label) {
            this.Amount = {
                currency: "XRP"
            }
            this.currency_label = label;
        } else {
            this.currency_label = currency.name + "." + currency.issuer;
            this.Amount = {
                currency: currency.name,
                counterparty: currency.issuer
            }
        }
        this.findPaths(this.amount_value);
    }
    findPaths(value) {
        if (value && value > 0) {
            console.log(value);
            this.Amount.value = value;
            this.isShowSendXRPbtn = this.Amount.currency=="XRP";
            console.log(this.Amount);
            var pathfind = {
                "source": {
                    "address": this.gv.wallet.address
                },
                "destination": {
                    "address": this.destination_address,
                    "amount": this.Amount
                }
            };
            console.log(pathfind);
            this.ripple.getPaths(pathfind).subscribe(result =>{
                console.log(result);
            })
        } else {
            console.log("输入value");
        }

    }
}
