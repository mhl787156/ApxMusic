import {Component, Output, EventEmitter} from '@angular/core';
import {User} from "../models/user";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {CORE_DIRECTIVES} from "@angular/common";
import {UserService} from "../user.service";

@Component({
    selector: 'search',
    template: `<div  dropdown [(isOpen)]="status.isopen"  class="btn-group" dropdown>
           <form class="navbar-form navbar-right" role="search">
                        <div class="form-group">
                            <input type="text" #search (keyup)="onKey(search.value)" class="form-control" placeholder="Search People">
                        </div>
   <!--                         <button id="single-button" type="button" class="btn btn-default" dropdownToggle [disabled]="disabled">
      <span class="caret"></span>
    </button>-->
                    </form>
    <ul  role="menu" aria-labelledby="single-button" class="dropdown-menu">
        <li *ngFor="let user of users"><a class="dropdown-item">{{user.name}}
      <button type="button" class="btn btn-default btn-xs align-right"  (click)="inviteUser(user.id)">
  <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Invite
</button>
</a></li>
    </ul>
</div>`,
    directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES],
    providers: [UserService]
})

export class SearchDropdownComponent {

    @Output() invite = new EventEmitter();

    users:User[] = [] = [{name: "OLI", avatar: "awf", projects: [], id: "a"}];

    public status:{isopen:boolean} = {isopen: false};

    constructor(private _userService:UserService) {

    }

    showList() {
        this.status.isopen = true;
    }

    hideList() {
        this.status.isopen = false;
    }

    onKey(search:string) {
        if (search == "") {
            this.hideList();
        }
        this._userService.getPeople(search).subscribe(res => {
            console.log(res);
            this.showList();
            this.users = res;
        })
    }


    inviteUser(id:string) {
        this.invite.emit({userId: id});
    }
}
