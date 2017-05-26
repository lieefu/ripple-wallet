import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../ripple.service';
import { GlobalVariable } from '../global-variable';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }
    asks: Array<Order> = new Array();
    bids: Array<Order> = new Array();
    limit: number = 20;
    orderbook: any = {
        base: {
            "currency": "XRP",
        },
        counter: {
            "currency": "CNY",
            "counterparty": "rKiCet8SdvWxPXnAgYarFUXMh1zCPz432Y"
        }
    };
    buys:Array<MyOrder> = new Array();
    sells:Array<MyOrder> = new Array();
    ngOnInit() {
        this.initOrders();
        this.getOrderbook();
        this.getMyOrders();
        setInterval(()=>{this.getOrderbook()},15000);
    }
    cancelOrder(sequence){
        console.log(sequence);
    }
    getMyOrders(){
        this.ripple.getOrders(this.gv.wallet.address).subscribe(result=>{
            console.log(result);
            this.setMyOrders(result.data);
        })
    }
    initOrders(){
        for(let i=0;i<this.limit;i++){
            if (!this.asks[i]) this.asks.push(new Order());
            if (!this.bids[i]) this.bids.push(new Order());
        }
    }
    getOrderbook() {
        console.log("get orderbook");
        this.ripple.getOrderbook(this.gv.wallet.address, this.orderbook, this.limit).subscribe(result => {
            if (result.ok) {
                this.setOrders(this.asks, result.data.asks);
                this.setOrders(this.bids, result.data.bids)
            } else {
                console.log("获取交易挂单数据失败");
            }
        })
    }
    setMyOrders(myorders){
        let selli=0;
        let buyi=0;
        for(let i=0;i<myorders.length;i++){
            let myorder=myorders[i];
            let tmp_order:MyOrder;
            console.log(myorder);
            if(myorder.specification.direction==="sell"){
                if(!this.sells[selli]) this.sells.push(new MyOrder());
                tmp_order=this.sells[selli];
                selli++;
            }else{
                if(!this.buys[buyi]) this.buys.push(new MyOrder());
                tmp_order=this.buys[buyi];
                buyi++;
            };
            let goods_value: number = parseFloat(myorder.specification.quantity.value);
            let money_value: number = parseFloat(myorder.specification.totalPrice.value);
            tmp_order.price = (money_value / goods_value).toFixed(5);

            tmp_order.goods.currency = myorder.specification.quantity.currency;
            tmp_order.goods.counterparty = myorder.specification.quantity.counterparty;
            tmp_order.goods.counterparty_short = this.shortAddress(tmp_order.goods.counterparty);
            tmp_order.goods.value = goods_value.toFixed();

            tmp_order.money.currency = myorder.specification.totalPrice.currency;
            tmp_order.money.counterparty = myorder.specification.totalPrice.counterparty;
            tmp_order.money.counterparty_short = this.shortAddress(tmp_order.money.counterparty);
            tmp_order.money.value = money_value.toFixed(2);
            tmp_order.sequence = myorder.properties.sequence;
        }
        console.log(this.buys,this.sells);
    }
    setOrders(d_orders: Array<Order>, s_orders) {
        let sum_goods: number = 0;
        let sum_money: number = 0;
        for (let i = 0; i < s_orders.length; i++) {
            let order: Order = d_orders[i];
            let goods: number = parseFloat(s_orders[i].specification.quantity.value);
            let money: number = parseFloat(s_orders[i].specification.totalPrice.value);
            order.price = (money / goods).toFixed(5);
            sum_goods += goods;
            sum_money += money;
            order.goods = goods.toFixed();
            order.money = money.toFixed(2);
            order.sum_goods = sum_goods.toFixed();
            order.sum_money = sum_money.toFixed(2);
            order.address = s_orders[i].properties.maker;
            order.address_short = this.shortAddress(order.address);
        }
    }
    shortAddress(address){
        if(!address) return "";
        let len = address.length;
        return  address.substr(0, 5) + "..." + address.substring(len - 3, len);
    }
}

class Order {
    price: string;
    goods: string;
    money: string;
    sum_goods: string;
    sum_money: string;
    address: string;
    address_short: string;
}
class Amount{
    currency:string;
    counterparty:string;
    counterparty_short:string;
    value:string;
}
class MyOrder {
    price: string;
    goods: Amount = new Amount();
    money: Amount = new Amount();;
    sequence:number;
}
