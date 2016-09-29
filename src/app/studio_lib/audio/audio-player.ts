import {ProjectContent} from "../src/data-classes/project-content";
import {Track, TrackNode} from "../src/data-classes/track";
import {SnippetContentDataService} from "../services/snippetcontent.data.service";
import {AudioEngineService} from "./audio-engine.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/concat';
import {SnippetContent} from "../src/data-classes/snippet";

declare var Tone: any;

export class AudioPlayer{

    projectContent: ProjectContent;
    currentTick: string = "0:0:0"
    dataService : SnippetContentDataService;

    transport: any;
    
    dataRetrieved = false;

    constructor(projectContent: ProjectContent, dataService: SnippetContentDataService){
        if(projectContent == null || dataService == null){
            return;
        }
        this.dataService = dataService;
        this.projectContent = projectContent;
        AudioEngineService.setToneTransportDefaults();
        Tone.Transport.cancel();
        this.convertProjectContentToTransport();
    }


    play(){
        // this.currentTick = AudioEngineService.transportTimeToTick(starttime);
        if(Tone.Transport.state == "paused") {
            Tone.Transport.start(this.currentTick);
        }
        console.log(Tone.Transport.state);
    }

    pause(){
        Tone.Transport.pause();
        console.log(Tone.Transport.state);
    }

    stop(){
        Tone.Transport.stop();
        Tone.Transport.cancel();
        this.currentTick = "0:0:0";
    }
    
    stepback(){
        
    }
    
    rewind(){
        
    }
    
    fastforward(){
        
    }
    
    stepforward(){
        
    }

    private convertProjectContentToTransport(){
        this.projectContent.tracks.map(track => this.convertToICallback(track));
    }

    private convertToICallback(track:Track){

        let flist: (Observable<Blob>)[] = track.tracknodes.map((tracknode) =>
            this.dataService.getSnippetContentFromServer(tracknode.snippetid)
                .map(res => {
                    return {
                        snippet: res,
                        tracknode: tracknode
                    }
                })
        );

        let t = Tone.Transport;
        //noinspection TypeScriptUnresolvedFunction
        Observable.forkJoin(flist).subscribe((res:Blob[]) => {
            let synth = new Tone.PolySynth(48, Tone.SimpleSynth).toMaster()
            let k = new Tone.Instrument;
            console.log(synth, k);
            res.map(content => {
                for(let j = 0; j < content.snippet.notes.length; j++) {

                    let time = AudioEngineService.convertToTransportTime(content.tracknode.starttime + j);
                    let notes: string[] = content.snippet.notes[j].map(note => note.pitch);
                    // let pi = JSON.parse(track.instrument);
                    t.schedule(function(t){
                        synth.triggerAttackRelease(notes, '16n');
                        this.currentTick = time;
                    }, time);
                }
            })
        });

        t.start();
    }
}

interface Blob{
    snippet: SnippetContent,
    tracknode: TrackNode
}