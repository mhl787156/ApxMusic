import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Notification} from "./models/notification";
import {Http, URLSearchParams} from "@angular/http";
import 'rxjs/add/operator/map';
import {Project} from "./studio_lib/src/data-classes/project";
import {User} from "./models/user";

@Injectable()
export class UserService {

    private _urlServer = "http://apx.twintailsare.moe:80/api/";

    constructor(private _http:Http) {

    }

    getUser(userId:string):Observable<User> {
        /*                    var user : User = {
         id : "segsegseg",
         name : "Oli",
         avatar : "built/app/img/oliprofile.png",
         projects : ['1','2']
         }
         //noinspection TypeScriptUnresolvedFunction
         return Observable.of(user);*/
        return this._http.get(this._urlServer + "user/7ab5cf5d-8347-4cbe-a97c-529f11668de5").map(res => res.json());
    }

    // Returns the current user
    getMe():Observable<User> {
        return this._http.get(this._urlServer + "me").map(res => res.json());
    }


    getNotifications(userId:string):Observable<Notification[]> {
        var nofts:Notification[] = [{
            seen: false,
            description: "Mickey invited you to a session",
            link: "awdagj"
        },
            {
                seen: false,
                description: "John invited you to a session",
                link: "awdaweg"
            }];

        //noinspection TypeScriptUnresolvedFunction
        return Observable.of(nofts);
    }

    getRecentUserProjects():Observable<Project[]> {
        return this._http.get(this._urlServer + "me/projects/meta").map(res => res.json());
    }

    makeNewProject():Observable<Project> {
        return this._http.post(this._urlServer + "project", "")
            .map(res => res.json());
    }

    leaveProject(pid:string) {
        return this._http.post(this._urlServer + "project/" + pid + "/leave", "")
            .toPromise().then(function (body) {
                console.log("left project");
            });
    }

    leaveProject2(pid:string) {
        return this._http.post(this._urlServer + "project/" + pid + "/leave", "")
            .map(res => res);
    }

    inviteOwner(pid:string, inviteeId:string) {
        return this._http.post(this._urlServer + "project/" + pid + "/addowner", JSON.stringify({
            "uid": inviteeId
        })).toPromise().then(function (body) {
            console.log("got reply");
        });
    }

    inviteOwner2(pid:string, inviteeId:string) {
        return this._http.post(this._urlServer + "project/" + pid + "/addowner", JSON.stringify({
            "uid": inviteeId
        })).map(res => res);
    }

    getPeople(search:string):Observable<User[]> {
        // Parameters obj-
        console.log("GETPEOPLE CALLED", search);
        return this._http.get(this._urlServer + "search/user/" + search
        ).map(res =>res.json());
    }
}
