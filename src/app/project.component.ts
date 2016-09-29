import {Component} from "@angular/core";
import {StudioComponent} from "./studio_lib/studio.component";

@Component({
    selector : "project",
    template : `<section class="studio">
                    <studio></studio>
                </section>`,
    styles : [`

                .studio {
                     padding: 0;
                }`],
    directives: [StudioComponent]
})

export class ProjectComponent {

}
