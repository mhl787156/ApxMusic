import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MdCard, MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_BUTTON_DIRECTIVES, MdButton} from '@angular2-material/button';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {UserService} from "../../../user.service";
import {Project} from "../../../studio_lib/src/data-classes/project";
import {SearchDropdownComponent} from "../../../dropdown_lib/search-dropdown.component";
import {AngularFire} from "angularfire2/angularfire2";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import {ToasterContainerComponent, ToasterService} from 'angular2-toaster';

@Component({
    selector: "project-list",
    template: `       <toaster-container></toaster-container><h2>{{title}}</h2>
                <ul>   
                     <li *ngFor="let project of projects"><md-card>
                         <md-card-title>{{project.name}}</md-card-title>
                         <md-card-content>
                         <!--<p>Owners</p>-->
                            <!--<p>{{project.owners}}</p>-->
                         </md-card-content>
                          <md-card-actions>                    
                          <button md-raised-button [routerLink]="['/Project', {id : project.id}]">OPEN</button>
                          <button md-raised-button (click)="leaveProject(project.id);">LEAVE</button>
                          <search (invite)="inviteUser($event, project)"></search>
                    </md-card-actions>
                    </md-card></li>
                </ul>

                `,
    styles: [`
                ul {
                    white-space: nowrap;
                    display: inline-block;
                }
                
                ul li {
                         display: inline;
                         display: inline-block;
                         margin-top: 0px;
                         margin-right: 15px;
                          margin-bottom: 15px;
                         margin-left: 0px;
                        }            
               `],
    directives: [MdCard, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES, MdButton, ROUTER_DIRECTIVES, SearchDropdownComponent, ToasterContainerComponent],
    providers: [UserService, ToasterService]

})

export class ProjectListComponent {

    @Input() title;

    @Input() projects:Project[];

    @Output() refresh = new EventEmitter();

    inviteeInput:string

    constructor(private _af:AngularFire, private _userService:UserService, private toasterService:ToasterService) {

    }

    onInput(pid, uid) {
        //noinspection TypeScriptUnresolvedFunction
        Observable.forkJoin([
            this._userService.inviteOwner2(pid, uid),
            this._userService.getMe()]
        ).subscribe(res => {
            var userRef = this._af.database.list('/' + uid);
            userRef.push({
                pid: pid,
                uid: res[1]
            });
            this.popToast();
            console.log("HOAWFAWWAF");
        });
    }

    popToast() {
        this.toasterService.pop('success', 'Invite Sent', "");
    }

    leaveProject(pid:string) {

        this._userService.leaveProject2(pid).subscribe(res => {
            console.log("LEFT PUNK", res);
            this.refresh.emit(null);

        });
    }

    inviteUser($event, project:Project) {
        console.log();
        this.onInput(project.id, $event.userId);

    }
}
