import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Track} from "../data-classes/track";
import {SingleTrackSettingComponent} from "./track-settings/single-track-setting.component";

@Component({
    selector : "track-settings",
    template : `<div style="height:0px;width:100%;"></div>
                <single-track-setting 
                    *ngFor="let track of tracks"
                    [track]="track"
                    (onchange)="onChange($event)">
                </single-track-setting>`,
    directives: [SingleTrackSettingComponent]


})

export class TrackSettingsComponent {

    @Input() tracks: Track[];
    @Output() onchange = new EventEmitter();

    onChange($event){
        if($event.delete != null){
            let i = this.tracks.indexOf($event.delete);
            if(i != -1){
                this.tracks.splice(i,1);
            }
        }
        this.onchange.emit($event);
    }

}
