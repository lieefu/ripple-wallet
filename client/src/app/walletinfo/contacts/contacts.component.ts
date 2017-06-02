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
        // this.gv.contacts.push(new Contact("myname", "rEp4SYVfwQgGbWCJV4tBAgGNpG2KeiaY1W"));
        // this.ripple.savecontacts(this.gv.contacts).subscribe(result =>{
        //     console.log(result);
        // })
        this.ripple.getcontacts().subscribe(result => {
            console.log(result);
            if (result.ok) {
                this.gv.contacts.data = result.data;
            }
        })
    }
    setAddress(name: string) {
        console.log(name);
        this.isExist = this.gv.contacts.existName(name);
        if (this.isExist) {
            this.address = this.gv.contacts.getContact(name).address;
        }
    }
    addContact(name: string, address: string) {
        this.gv.contacts.addContact(name, address);
        this.saveContacts();
    }
    delContact(name:string){
        this.gv.contacts.delContact(name);
        this.saveContacts();
    }
    saveContacts() {
        this.ripple.savecontacts(this.gv.contacts.data).subscribe(result => {
            console.log(result);
        })
    }
}
