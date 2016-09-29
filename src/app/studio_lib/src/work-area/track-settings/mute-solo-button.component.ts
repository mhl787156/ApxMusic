import {Component, Input, Output, EventEmitter} from "@angular/core";
import {NgClass} from "@angular/common"

@Component({
    selector : "mute-solo-button",
    template : `<div class="btn-group apx-mute-solo-btn">
                    <button type="button" 
                            class="btn-default btn btn-sm"
                            aria-label="Mute"
                            (click)="setMute()"
                            [ngClass]="{active :muted}">
                            Mute
                    </button>
                    <button type="button" 
                            class="btn-default btn btn-sm"
                            aria-label="Solo"
                            (click)="setSolo()"
                            [ngClass]="{active: solod}">
                            Solo
                    </button>
                </div>`,

    styles: [`.active {
                background-color=blue;
              }
              
              .btn-group {
                margin-top: 5px;
              }
            `],
    directives: [NgClass],

})

export class MuteSoloButtonComponent {

    @Input() mute: boolean;
    @Input() solo: boolean;

    @Output() toggle = new EventEmitter();

    setMute(){
        this.mute = !this.mute;
        this.sendStatus();
    }

    setSolo(){
        this.solo = !this.solo;
        this.sendStatus();
    }

    sendStatus(){
        this.toggle.emit({
            mute: this.mute,
            solo: this.solo,
        })
    }

}
