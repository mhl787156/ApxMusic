(function (global) {
    // map tells the System loader where to look for things
    var map = {
        defaultJSExtensions: true,
        'app': 'built/app', // 'dist',
        'rxjs': 'node_modules/rxjs',
        'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
        '@angular': 'node_modules/@angular',
        moment: 'node_modules/moment/moment.js',
        '@angular2-material/core': 'node_modules/@angular2-material/core',
        '@angular2-material/checkbox': 'node_modules/@angular2-material/checkbox',
        '@angular2-material/card': 'node_modules/@angular2-material/card',
        '@angular2-material/button': 'node_modules/@angular2-material/button',
        '@angular2-material/sidenav': 'node_modules/@angular2-material/sidenav',
        '@angular2-material/list': 'node_modules/@angular2-material/list',
        '@angular2-material/input': 'node_modules/@angular2-material/input',
        'facebook-ts': 'node_modules/facebook-ts',
        'ng2-facebook': 'node_modules/ng2-facebook',
        'firebase': 'node_modules/firebase/lib',
        'angularfire2': 'node_modules/angularfire2',
        'angular2-toaster': 'node_modules/angular2-toaster'
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': {main: 'main.js', defaultExtension: 'js'},
        'rxjs': {defaultExtension: 'js'},
        'angular2-in-memory-web-api': {defaultExtension: 'js'},
        '@angular2-material/core': {main: 'core.js', defaultExtension: 'js'},
        '@angular2-material/checkbox': {main: 'checkbox.js', defaultExtension: 'js'},
        '@angular2-material/button': {main: 'button.js', defaultExtension: 'js'},
        '@angular2-material/progress-circle': {main: 'progress-circle.js', defaultExtension: 'js'},
        '@angular2-material/card': {main: 'card.js', defaultExtension: 'js'},
        '@angular2-material/input': {main: 'input.js', defaultExtension: 'js'},
        '@angular2-material/toolbar': {main: 'toolbar.js', defaultExtension: 'js'},
        '@angular2-material/sidenav': {main: 'sidenav.js', defaultExtension: 'js'},
        '@angular2-material/list': {main: 'list.js', defaultExtension: 'js'},
        'ng2-facebook': {main: 'ng2-facebook.js', defaultExtension: 'js'},
        'firebase': {main: 'firebase-web.js', defaultExtension: 'js'},
        'angularfire2': {main: 'angularfire2.js', defaultExtension: 'js'},
        'angular2-toaster': {main: 'angular2-toaster.js', defaultExtension: 'js'}
    };
    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/testing',
        '@angular/upgrade',
    ];

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function (pkgName) {
        packages[pkgName] = {main: 'index.js', defaultExtension: 'js'};
    });

    var config = {
        map: map,
        packages: packages
        //paths: paths
    }

    System.config(config);
})(this);
