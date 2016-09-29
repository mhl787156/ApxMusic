import {Component, Input} from "@angular/core";
import {ControlButtons} from "../utils/control-buttons";
import {ChatComponent} from "../chat.component";

declare var Tone:any;
@Component({
    selector: "transport",
    templateUrl: "app/studio_lib/html/bottom-bar/transport.component.html",
    styleUrls: ["app/studio_lib/css/bottom-bar/transport.component.css"],
    directives : [ChatComponent]
})

export class TransportComponent {
    
    playpressed: boolean = false;

    buttonpressed:ControlButtons;

    @Input() pid;

    constructor() {
        this.buttonpressed = ControlButtons.getInstance();
        this.buttonpressed.resetButtons();
    }

    getToneTransportPosition(){
        let k = (Tone.Transport.position).split(':');
        let j = k.map(p => parseInt(p));
        return (j[0] > 9 ? '' + j[0] : '0' + j[0]) +':0'+ j[1] + ':0' + j[2];
    }
    
    setToneTransportPosition(e){
        Tone.Transport.position = e;
    }

    minimiseBottom() {
        this.buttonpressed.MinimiseBottomBar = !this.buttonpressed.MinimiseBottomBar;
    }

    minimiseSidebar() {
        this.buttonpressed.MinimiseSideBar = !this.buttonpressed.MinimiseSideBar;
    }

    addTrackButton() {
        this.buttonpressed.AddTrack();
    }

    stepBack() {
        this.buttonpressed.AudioPlayer.stepback()
    }

    rewind() {
        this.buttonpressed.AudioPlayer.rewind();
    }

    play() {
        this.buttonpressed.Play = true;
        this.buttonpressed.resetAudioPlayer();
        this.buttonpressed.AudioPlayer.play();
    }

    pause() {
        this.buttonpressed.Play = false;
        this.buttonpressed.AudioPlayer.pause();
    }

    stop() {
        this.buttonpressed.Play = false;
        this.buttonpressed.AudioPlayer.stop();
    }

    fastForward() {
        this.buttonpressed.AudioPlayer.fastforward();
    }

    stepForward() {
        this.buttonpressed.AudioPlayer.stepforward()
    }

}


