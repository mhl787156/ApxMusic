import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'account-dropdown',
    templateUrl: "app/dropdown_lib/account-dropdown.component.html",
    directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    styleUrls: ["app/dropdown_lib/styles.css"]
})
export class AccountDropdownComponent {

    public status:{isopen:boolean} = {isopen: false};

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }

    public toggleDropdown($event:MouseEvent):void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    private logout(): void {
        console.log("Logging out...");
        document.cookie = "apx_session=; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=.apx.twintailsare.moe; path=/";
    }
}
