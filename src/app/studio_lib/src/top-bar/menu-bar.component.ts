import {Component} from "@angular/core";

@Component({
    selector: "menu-bar",
    templateUrl: "app/studio_lib/html/top-bar/menu-bar.component.html",
    styles: [`
    .apx-menu-list {
        float:left;
        margin-left: 10px;
        height:25px;
        width:40%;
        vertical-align: middle;
        position: fixed;
    }

    .glyphicon {
        margin-right: 5px;
        wdith: 20px;
    }

    .flipped {
        -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        -webkit-transform: scaleX(-1);
        transform: scaleX(-1);
        filter: FlipH;
        -ms-filter: "FlipH";
    }
        `]
})

export class MenuBarComponent {
    menuItems:string[] = ["File", "Edit", "View"];
}
