export interface INote{
    pitch: string;
    duration: string;
    starttime: number;
}

export class Note implements INote{
    pitch: string;
    duration: string;
    starttime:number;
    
    constructor(pitch: string, starttime:number){
        this.pitch = pitch;
        this.duration = '8n';
        this.starttime = starttime;
    }

    static fromJson(json:INote) {
        let note = Object.create(Note.prototype);
        return Object.assign(note, json, { });
    }
}