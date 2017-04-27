import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RippleService} from './ripple.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
    constructor(private ripple: RippleService,private router:Router) {
    }

    ngOnInit() {
        this.ripple.getWallets().subscribe(result=>{
            console.log(result);
            this.router.navigate(['/wallet']);
        })
    }
}
