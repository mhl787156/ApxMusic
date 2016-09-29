import {Component} from "@angular/core";
import {RouterOutlet, RouteConfig, RouterLink} from "@angular/router-deprecated";
import {ExploreComponent} from "./landing_lib/explore.component";
import {HomeComponent} from "./landing_lib/home.component";
import {LoginComponent} from "./landing_lib/login.component";


@RouteConfig([
    {path: '/', name: "HomeRoot", component: HomeComponent, useAsDefault: true},
    {path: '/home', name: "Home", component: HomeComponent},
    {path: '/explore', name: "Explore", component: ExploreComponent},
    {path: '/login', name: "Login", component: LoginComponent}
])

@Component({
    selector: 'landing',
    template: `<div class="site-wrapper">

                  <div class="site-wrapper-inner">
            
                    <div class="cover-container">
            
                      <header class="masthead clearfix">
                        <div class="inner">
                          <h3 class="masthead-brand">
                            <a href="#Home"><img width="60%" src="built/app/img/logo/logo.svg" alt="APx Music Logo"></a>
                          </h3>
                          <nav>
                            <ul class="nav masthead-nav">
                              <li><a [routerLink]="['Home']">Studio</a></li>
                              <li><a [routerLink]="['Explore']">Explore</a></li>
                              <li><a [routerLink]="['Login']">Sign In</a></li>
                            </ul>
                          </nav>
                        </div>
                      </header>
            
                     <section class="inner cover">
                           <router-outlet></router-outlet>
                     </section>
            
                      <footer class="mastfoot">
                        <div class="inner">
                          <p>&copy; 2016</p>
                        </div>
                  
                      </footer>
            
                    </div>
                  </div>
            
                </div>`,
    styleUrls: ["app/landing_lib/cover.css", "app/landing_lib/apx_style.css"],
    directives: [RouterOutlet, RouterLink]
})

export class LandingComponent {

}