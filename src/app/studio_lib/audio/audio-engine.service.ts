import {Injectable} from "@angular/core";
import {Note} from "../src/data-classes/note";

declare var Tone: any;

const POLY_VOICES = 48;

@Injectable()
export class AudioEngineService   {

    synth;
    synth2;

    currentTime:number = 23;
    tempoBPM : number = 60;

    noteLetters : string[] = ["B","A#","A","G#","G","F#","F","E","D#","D","C#","C"];

    constructor(){
        this.synth = new Tone.PolySynth(POLY_VOICES, Tone.SimpleSynth).toMaster();
        this.synth2 = new Tone.SimpleSynth().toMaster();
        AudioEngineService.setToneTransportDefaults();
        this.synth.set("oscillator", {"type" : "triangle"});
    }


    gridIndextoNote(i: number): string{
        let mod = i % (this.noteLetters.length);
        let k = Math.floor(i/(this.noteLetters.length));
        let noteLetter:string = this.noteLetters[mod];
        return noteLetter + (7 - k).toString();
    }

    notetoGridIndex(note: string):number{

        let i = this.noteLetters.indexOf(note[0].toUpperCase());
        let j = 0;
        if(note[1] == '#'){
            i--;
            j = parseInt(note[2]);

        } else {
            j = parseInt(note[1]);
        }
        return i + ( 7 - j ) * (this.noteLetters.length);
    }

    polyphonicSinglePlay(notes:Note[][], synth = null) {
        if(synth != null){
            this.synth = new Tone.PolySynth(POLY_VOICES, synth).toMaster();
        }
        
        let t = Tone.Transport;
        t.cancel();
        for (var i = 0; i < notes.length; ++i) {
            if(notes[i].length == 0){
                continue;
            }
            let startTime = AudioEngineService.convertToTransportTime(i);
            let pitches = notes[i].map(function(note){return note.pitch;});
            t.schedule(time => this.synth.triggerAttackRelease( pitches, "16n"), startTime);
        }

        t.start();
    }

    static setToneTransportDefaults(){
        Tone.Transport.setInterval(function(time){}, "16n");
        Tone.Transport.bpm.value = 60;
    }

    stopPlay() {
        Tone.Transport.stop();
        Tone.Transport.cancel(0);
    }

    playNote(pitch: string){
        this.synth2.triggerAttackRelease(pitch, "16n");
    }

    static convertToTransportTime(i: number):string{
        let startBars = Math.floor(i/16);
        let insideBar = i % 16;
        let startQuarters = Math.floor(insideBar/4);
        let startSixteenths = insideBar % 4;
        let startTime = startBars.toString() + ":" + startQuarters.toString() + ":" + startSixteenths.toString();
        return startTime;
    }

    static transportTimeToTick(s: string){
        let k = s.split(':');
        let m = k.map(j => parseInt(j));
        return (m[0] * 16) + (m[1] * 4) + m[2];
    }
}
