import {Injectable} from "@angular/core";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import {Project, IProject} from "../src/data-classes/project";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ProjectDataService {

    private _urlServer = "http://apx.twintailsare.moe:80/api/";

    constructor(private _http:Http) {

    }

    // Gets the project from the server
    getProjectFromServer(id:string):Observable<Project> {
        let uri:string = this._urlServer + "project/" + id;
        return this._http.get(uri).map(res => res.json());
    }


    postProjectMetaChangeToServer(project:Project) {
        console.log("Sending", project);
        return this._http.post(this._urlServer + "project/" + project.id + "/meta", JSON.stringify(project))
            .map(res => res);
    }
}
