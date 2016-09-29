import {Track, ITrack} from "./track";

export interface IProjectContent {
    id: string;
    tracks: ITrack[];
    tempo: number;
}

export class ProjectContent implements IProjectContent{
    id: string;
    tracks: Track[];
    tempo: number;
}