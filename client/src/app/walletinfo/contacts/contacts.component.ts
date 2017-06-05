import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from '../../ripple.service';
import { GlobalVariable, Tipinfo, Contact} from '../../global-variable';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
    name: string;
    address: string;
    isExist: boolean = false;
    constructor(private ripple: RippleService, private gv: GlobalVariable, private router: Router) { }

    ngOnInit() {
        this.ripple.getdata().subscribe(result => {
            console.log(result);
            if (result.ok) {
                this.gv.data.contacts = result.data.contacts;
                this.gv.data.tradepare = result.data.tradepare;
            }
        })
    }
    setAddress(name: string) {
        console.log(name);
        this.isExist = this.gv.data.existName(name);
        if (this.isExist) {
            this.address = this.gv.data.getContact(name).address;
        }
    }
    addContact(name: string, address: string) {
        this.gv.data.addContact(name, address);
        this.saveContacts();
    }
    delContact(name:string){
        this.gv.data.delContact(name);
        this.saveContacts();
    }
    saveContacts() {
        this.ripple.savedata(this.gv.data).subscribe(result => {
            console.log(result);
        })
    }
}
