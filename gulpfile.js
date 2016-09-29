var gulp = require('gulp');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
const del = require('del');
var tsProject = tsc.createProject('tsconfig.json');
var config = require('./gulp.config')();

var browserSync = require('browser-sync');
var superstatic = require('superstatic');

var watch = require('gulp-watch');

var Server = require('karma').Server;

gulp.task('ts-lint', function () {
    return gulp.src(config.allTs)
        .pipe(tslint())
        .pipe(tslint.report('prose'), {
            emitError: false
        })
});


gulp.task('compile-ts', function () {
    var sourceTsFiles = [
        config.allTs
    ];

    var tsResult = gulp
        .src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.tsOutputPath));
});

gulp.task('serve', ['copy:assets', 'compile-ts'], function () {
    gulp.watch([config.allTs], ['compile-ts']);
    browserSync({
        port: 3000,
        files: ['./built'],
        injectChanges: true,
        logFileChanges: false,
        logLevel: 'silent',
        notify: true,
        reloadDelay: 0,
        server: {
            baseDir: './src/',
            middleware: superstatic({debug: false})
        }
    });

});

gulp.task('watch-compile', function () {
    gulp.watch([config.allTs], ['compile-ts']);
});

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('built/**/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', function () {
    return gulp.src(['src/app/**/*', '!src/app/**/*.ts'], {base: './src'})
        .pipe(gulp.dest('./built'))
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:index', function () {
    return gulp.src(['index.html'], {base: './'})
        .pipe(gulp.dest('./built'))
});

gulp.task('watch-static', function () {
    gulp.watch(['src/app/**/*', '!src/app/**/*.ts'], function (obj) {
            if (obj.type === 'changed') {
                gulp.src(obj.path, {"base": "./src"})
                    .pipe(gulp.dest('built'));
            }
        }
    );
});

gulp.task('test', ['compile-ts'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('default', ['copy:assets', 'watch-static', 'compile-ts', 'watch-compile']);

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    gulp.watch([config.allTs], ['ts-lint', 'compile-ts']);
    new Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('once',['copy:assets', 'compile-ts']);
