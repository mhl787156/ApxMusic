import {AudioPlayer} from "../../audio/audio-player";
export class ControlButtons{

    Play: boolean;
    MinimiseBottomBar : boolean;
    MinimiseSideBar : boolean;
    AddTrack: Function;
    AudioPlayer: AudioPlayer;
    generateAudioPlayerCallback: Function;

    static instance:ControlButtons;
    static isCreating:Boolean = false;

    constructor() {
        if (!ControlButtons.isCreating) {
            throw new Error("You can't call new in Singleton instances!");
        }
        this.resetButtons();
        this.AddTrack = ()=>{};
        this.generateAudioPlayerCallback = ()=>{};
        this.AudioPlayer = new AudioPlayer(null, null);
    }
    
    resetButtons(){
        this.Play = false;
        this.MinimiseBottomBar = false;
        this.MinimiseSideBar = false;
    }

    setAddTrackFunction(f : Function){
        this.AddTrack = f;
    }
    
    resetAudioPlayer(){
        this.AudioPlayer = this.generateAudioPlayerCallback();
        console.log("Generatring Audio Player", this.AudioPlayer);
    }
    
    setAudioPlayerGenerator(f : Function){
        this.generateAudioPlayerCallback = f;
    }
    
    static getInstance() {
        if (ControlButtons.instance == null) {
            ControlButtons.isCreating = true;
            ControlButtons.instance = new ControlButtons();
            ControlButtons.isCreating = false;
        }

        return ControlButtons.instance;
    }

}