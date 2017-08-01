import { Component, OnInit,ViewChild, TemplateRef } from '@angular/core';
import {RippleService} from './ripple.service';
import { GlobalVariable } from './global-variable';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    version: string="1.0.0";
    newversion:string;
    url:string;
    msg:string;
    @ViewChild('alertcontent')
    private alertcontent: TemplateRef<any>;
    constructor(private ripple: RippleService,private gv: GlobalVariable, private modalService: NgbModal) {
    }
    ngOnInit() {
        this.ripple.getLastVersion().subscribe(result=>{
            console.log(result);
            if(result.ok&&this.ripple.ltVersion(this.version,result.version)){
                this.msg=result.message;
                this.url=result.url;
                this.newversion = result.version;
                this.open(this.alertcontent);
            }
        });
    }
    open(content) {
        this.modalService.open(content).result.then((result) => {
            ;//this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            ;//this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
}
