import {Component, Input, Output, EventEmitter} from "@angular/core";
import {MuteSoloButtonComponent} from "./mute-solo-button.component";
import {Track} from "../../data-classes/track";

@Component({
    selector : "single-track-setting",
    template : `<div class='track-settings'>
                  
                            
                  <!-- Track name -->
                  <input type="text" 
                         class="input-group-sm form-control apx-track-name"
                         placeholder="Track Name" 
                         aria-describedby="sizing-addon3"
                         value="{{track.name}}">
                  <!-- Mute/Solo -->
                  <mute-solo-button [mute]="track.mute"
                                    [solo]="track.solo"
                                    (toggle)="onToggle($event)">
                  </mute-solo-button>
                  
                  <button type="button" class="btn-default btn btn-xs  mybutton" aria-label="Trash" (click)="deleteTrack()">
                    <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                  </button>
                  
                  </div>`,

    styles: [`  .track-settings{
                    width:100%;
                    height: 150px;
                    background: linear-gradient(#666, #333);
                    align-items: center;
                    border: 1px solid;
                }
                    
                .apx-track-name{
                    width:95%;
                    margin-top: 20px;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .snippet-add-button{
                    position:relative;
                }
                
                .mybutton {
                    
                }
    `],
    directives: [MuteSoloButtonComponent]
})

export class SingleTrackSettingComponent {
    
    @Input() track:Track;
    @Output() onchange = new EventEmitter();

    onToggle($event){
        this.onchange.emit({});
    }

    deleteTrack(){
        console.log("Deleting Track" )
        this.onchange.emit({
            delete: this.track
        });
    }

}
