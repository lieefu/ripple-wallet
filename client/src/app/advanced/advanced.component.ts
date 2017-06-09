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
    serverURL:string;
    servers:Array<any>=[];
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.name = this.gv.wallet.name;
        this.ripple.getconfig().subscribe(result =>{
            console.log(result);
            if(result.ok){
                this.servers = result.data.servers;
            }
        })
    }
    addServer(url){
        this.servers.push({url:url,flag:1});
        this.saveConfig();
    }
    saveConfig(){
        this.ripple.saveconfig({servers:this.servers}).subscribe(result =>{
            console.log(result);
        })
    }
    reconnect(url){
        console.log("连接服务器"+url);
        this.gv.connected=false;
        this.ripple.reconnect(url).subscribe(result =>{
            console.log(result);
            this.gv.connected = result.ok;
        })
    }
    delserver(url){
        console.log(url);
        let needsave = false;
        for (let i = this.servers.length; i--;) {
            console.log(i);
            if (this.servers[i].url == url) {
                this.servers.splice(i, 1);
                needsave = true;
            }
        }
        if(needsave) this.saveConfig();
    }
    ////////////////////////
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
