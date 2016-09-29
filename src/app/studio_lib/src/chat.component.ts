import {Component, Input, OnInit, ElementRef, ViewChild, AfterViewChecked} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2/angularfire2";
import {Message} from "../../models/message";
import {UserService} from "../../user.service";
import {User} from "../../models/user";
import  {MD_LIST_DIRECTIVES, MdList, MdListItem} from "@angular2-material/list";
import  {MD_INPUT_DIRECTIVES, MdInput} from "@angular2-material/input";

@Component({
    selector: 'chat',
    template: `
                <div *ngIf="chatVisible" class="popup-box  popup-messages" #chatlist>
                <md-list>
                  <md-list-item *ngFor="let message of messages | async">
                    <h3 md-line> {{message.sender}} </h3>
                    <p md-line>
                      <span class="demo-2"> -- {{message.message}} </span>
                    </p>
                  </md-list-item>
                </md-list>
                </div>
                <span class="chat-input">
                    <md-input (keyup)="doneTyping($event)" placeholder="Message..." class="demo-full-width"></md-input>        
                    <i class="pull-right glyphicon" (click)="toggle()"
                        [ngClass]=" {
                                'glyphicon-chevron-down' : chatVisible,
                                'glyphicon-chevron-up' : !chatVisible  }"></i>
                </span>
          `,
    styles: [`
                     
                .popup-box {
                        height: 100%;
                        overflow-y: scroll;
                        position: fixed;
                        bottom: 52px;
                        height: 285px;
                        background-color: rgb(237, 239, 244);
                        width: 300px;
                        border: 1px solid rgba(29, 49, 91, .3);
                    }
                    
                .popup-box .popup-messages {
                        height: 100%;
                        overflow-y: scroll;
                  }
                  
                  .chat-input {
                       position: fixed;
                         width: 200px;
                         bottom: 20px;
                         height: 32px;
                  }
                  
                  .glyphicon {
                    margin-top: 20px;
                  }
          


            `],
    directives: [MD_LIST_DIRECTIVES, MdList, MdListItem, MD_INPUT_DIRECTIVES, MdInput],
    providers: [UserService]

})
export class ChatComponent implements OnInit,AfterViewChecked {

    @ViewChild('chatlist') private myScrollContainer:ElementRef;

    @Input() pid:string;
    user:User;

    chatVisible:boolean = false;

    messages:FirebaseListObservable<Message[]>;

    constructor(private _af:AngularFire, private _userService:UserService) {

    }

    ngOnInit() {
        this._userService.getMe().subscribe(user=> {
            this.user = user;
        });
        this.messages = this._af.database.list('/' + this.pid);
        console.log("CHAT COMPONT", this.pid);
        this.scrollToBottom();
    }

    doneTyping($event) {
        if ($event.which === 13) {
            this.pushMessage($event.target.value);
            $event.target.value = null;
        }
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    pushMessage(message:string) {
        this.messages.push({
            sender: this.user.name,
            message: message
        });
    }

    toggle() {
        this.chatVisible = !this.chatVisible;
    }

    scrollToBottom():void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) {
        }
    }

}
