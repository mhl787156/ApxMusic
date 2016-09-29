import {Component, Input} from "@angular/core";
import {TransportComponent} from "../bottom-bar/transport.component";
import {ChatComponent} from "../chat.component";

@Component({
    selector: "bottom-bar-area",
    template: `<footer class="apx-bottom-toolbar">
                    <transport [pid]="pid"></transport>
                </footer>`,
    styleUrls: ["app/studio_lib/css/bottom-bar/bottom-bar-area.component.css"],
    directives: [TransportComponent, ChatComponent],
})

export class BottomBarAreaComponent {
    @Input() projectContentId:string;
    @Input() pid:string;

}
