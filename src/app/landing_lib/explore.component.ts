
import {Component} from "@angular/core";
@Component({
    selector : "explore",
    template : `<form class="navbar-form" role="form">
                    <div class="input-group input-group-lg">
                      <span class="input-group-addon" id="explore-searchbox">
                        <span class="glyphicon glyphicon-search"></span>
                      </span>
                        <input type="text" class="form-control" placeholder="Explore...">
                    </div>
                </form>`,
    styleUrls: ["app/landing_lib/apx_style.css"]
})

export class ExploreComponent {
    
}
