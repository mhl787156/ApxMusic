import {Component, Input} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {Notification} from "../models/notification";
import {UserService} from "../user.service";
import {OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2/angularfire2";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'notifications-dropdown',
    directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES,ROUTER_DIRECTIVES],
    templateUrl: "app/dropdown_lib/notifications-dropdown.component.html",
    styleUrls: ["app/dropdown_lib/styles.css"],
    providers: [UserService]
})
export class NotificationsDropdownComponent implements OnInit {

    userId:string;
    notifications:FirebaseListObservable<any[]>;

    ngOnInit() {
        this._userService.getMe().subscribe(res => {
            this.userId = res.id;
            this.notifications = this._af.database.list('/' + this.userId);
        })
    }

    public status:{isopen:boolean} = {isopen: false};


    constructor(private _userService:UserService, private _af:AngularFire) {

    }

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    onClick() {
        console.log("DROPDOWN");
        console.log(this.notifications);
    }
    
}