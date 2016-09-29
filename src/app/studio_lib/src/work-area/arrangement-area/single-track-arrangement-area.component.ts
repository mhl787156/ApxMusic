import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Track} from "../../data-classes/track";

@Component({
    selector : "single-track-arrangement-area",
    template : `
                <div class="single-arrangement-area">
                
                    <table>
                        <tr>
                            <td *ngFor="let col of numCols"></td>    
                        </tr>
                    </table>
                
                </div>
                `,

    styles: [`
        .single-arrangement-area {
            position: relative;
            height:100%;
            width:100%;
        }
    
        table, tr, td ,th {
            border: 1px solid black;
            border-collapse: collapse;
        }
        
        table {
            position: absolute;
            left: 0;
            top: 0;
            height:100%;
            width: 100%;
        }
    `],

})

export class SingleTrackArrangementAreaComponent {
    
    @Input() track: Track;
    @Output() onchange = new EventEmitter();
        
    numCols = new Array(60);

    constructor(){

    }

    onChange($event){
        $event.trackChanged = false;
        $event.track = this.track;
        this.onchange.emit($event)
        console.log("STAA onChange",  $event);
    }
        

}
