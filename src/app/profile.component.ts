import {Component, Input, OnInit} from "@angular/core";
import {UserService} from "./user.service";
import {HTTP_PROVIDERS} from "@angular/http";


@Component({
    selector: 'user-profile',
    templateUrl: "app/html/profile.component.html",
    styleUrls: ["app/css/profile.component.css"],
    providers : [HTTP_PROVIDERS]
})

export class ProfileComponent implements OnInit {


    @Input() user = {};

    constructor(private _userService:UserService) {

    }

    ngOnInit():any {
        this._userService.getMe()
            .subscribe(res => {
                console.log(res);
                this.user = res;
            })
    }
}
