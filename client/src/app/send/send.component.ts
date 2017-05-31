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
    timer;
    ngOnDestroy() {
        if(this.timer) clearInterval(this.timer);
        this.timer = null;
        console.log("SendComponent ngOnDestroy");
    }
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    tipinfo: string;
    tipinfo_path:string;
    recipient_label: string;
    currency_label: string = "XRP- Ripples";
    Amount: any = {
        currency: "XRP",
        value: 0
    };
    destination_address: string;
    amount_value: number;
    pathfind: any;
    currencies = [];
    paths = [];
    payment: any;
    isShowAmount: boolean = false;
    isShowSendXRPbtn: boolean = false;
    isShowPaths: boolean = false;
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
                    if (result.data.name == "TimeoutError") {
                        this.tipinfo = "超时错误，请稍后再试！";
                    } else {
                        this.tipinfo = "钱包地址格式错误。";
                    }
                };
            }
        });
    }
    setCurrency(currency, label) {
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
        this.setValue(this.amount_value);
    }
    setValue(value) {
        if (value && value > 0) {
            this.paths = [];
            this.isShowSendXRPbtn = (this.Amount.currency == "XRP");
            this.Amount.value = value;
            this.pathfind = {
                "source": {
                    "address": this.gv.wallet.address
                },
                "destination": {
                    "address": this.destination_address,
                    "amount": this.Amount
                }
            };
            this.tipinfo = ` 转账资产：“${this.Amount.value}${this.Amount.currency}” 接收方地址：“${this.destination_address}” `;
            if (!this.timer) this.timer = setInterval(() => { this.findPaths(); }, 10000);
            this.findPaths();
        } else {
            this.tipinfo = "请输入发送数量";
        }
    }
    findPaths() {
        console.log("find paths", this.pathfind);
        this.ripple.getPaths(this.pathfind).subscribe(result => {
            //console.log(result);
            if (result.ok) {
                this.paths = result.data;
                this.isShowPaths = true;
                this.tipinfo_path = `点击上面按钮，将发送按钮上标注的资产，接收方：${this.destination_address} 收到：${this.Amount.value}${this.Amount.currency}`;
            } else {
                this.paths = [];
                this.isShowPaths = false;
                this.tipinfo_path = "";
            }
        })
    }
    sendXRP(value) {
        console.log("send", value, "XRP");
        this.payment = {
            "source": {
                "address": this.gv.wallet.address,
                "maxAmount": this.pathfind.destination.amount
            },
            "destination": this.pathfind.destination
        };
        this.sendPayment(this.payment);
    }
    sendIOU(path) {
        console.log("send", path);
        this.payment = path;
        this.sendPayment(this.payment);
    }
    sendPayment(payment) {
        console.log("payment:", payment);
        this.ripple.sendPayment(payment).subscribe(result =>{
            console.log(result);
        })
    }
}
