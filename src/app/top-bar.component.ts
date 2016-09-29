import {Component, Input} from "@angular/core";
import {Notification} from "./models/notification";
import {AccountDropdownComponent} from "./dropdown_lib/account-dropdown.component";
import {NotificationsDropdownComponent} from "./dropdown_lib/notifications-dropdown.component";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import {SearchDropdownComponent} from "./dropdown_lib/search-dropdown.component";
import {UserService} from "./user.service";

@Component({
    selector: "top-bar",
    templateUrl: "app/html/top-bar.component.html",
    styleUrls: ["app/css/top-bar.component.css"],
    directives: [AccountDropdownComponent, NotificationsDropdownComponent, SearchDropdownComponent],
    providers : [UserService]
})

export class TopBarComponent {
    @Input() avatarUrl;
    @Input() username = "someUser";

    constructor() {
    }

    onKey(search : string) {
        console.log(search);
    }

    /*
     onClick() {
     console.log("TOPBAR");
     console.log(this.notifications);
     } */
}
