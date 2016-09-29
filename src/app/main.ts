/// <reference path="../../typings/browser/ambient/es6-shim/index.d.ts" />
/// <reference path="../../typings/globals/firebase/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />

import {bootstrap}    from "@angular/platform-browser-dynamic";
import {AppComponent} from "./app.component";
import {ROUTER_PROVIDERS} from "@angular/router-deprecated";
import {defaultFirebase, FIREBASE_PROVIDERS} from "angularfire2/angularfire2";
 
bootstrap(AppComponent, [ROUTER_PROVIDERS, FIREBASE_PROVIDERS,
    defaultFirebase('https://project-2126954098979311260.firebaseio.com')]);