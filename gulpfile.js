/*
 global require
 */
'use strict';

/**
 * Inspired by the builds of https://github.com/kriasoft/react-starter-kit and https://github.com/angular/angular
 */

var gulp = require('gulp');
var http = require('http');
/**
 * Namespace the required plugins to make it clear. Projects that prefer to
 * use auto import (e.g. 'var $ = require('gulp-load-plugins')();') can just rename 'g' to '$'.
 */
var g = {
  angularTemplateCache: require('gulp-angular-templatecache'),
  autoprefixer: require('gulp-autoprefixer'),
  csscomb: require('gulp-csscomb'),
  debug: require('gulp-debug'),
  del: require('del'),
  gutil: require('gulp-util'),
  if: require('gulp-if'),
  karma: require('karma').server,
  minifyCss: require('gulp-minify-css'),
  minifyHtml: require('gulp-minify-html'),
  minimist: require('minimist'),
  plumber: require('gulp-plumber'),
  rev: require('gulp-rev'),
  runSequence: require('run-sequence'),
  sass: require('gulp-sass'),
  shell: require('gulp-shell'),
  size: require('gulp-size'),
  sourcemaps: require('gulp-sourcemaps'),
  st: require('st'),
  liveReload: require('gulp-livereload'),
  uglify: require('gulp-uglify'),
  usemin: require('gulp-usemin')
};

/**
 *  Build flags.
 */
var B = {
  RELEASE: false
};

/**
 * Accumulate source file globs as we move through the build process. For use by watch, logging, etc.
 */
var src = {
  vendor: {}
};


/**
 * The browser versions that we want to support. Autoprefixer will augment our CSS with the
 * appropriate browser-specific prefixes.
 * https://github.com/ai/autoprefixer
 */
var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


gulp.task('build.images', function(){
  src.vendor.images = ['app/bower_components/material-design-icons/sprites/svg-sprite/*.svg'];
  return gulp.src(src.vendor.images)
    .pipe(gulp.dest('build/dist/static/'));
});

gulp.task('build.styles', ['build.images'], function () {
  src.styles = ['app/components/**/*.{scss,_scss}', '!app/components/**/_*.{scss}'];
  return gulp.src(src.styles)
    .pipe(g.plumber())
    .pipe(g.sass({
      errLogToConsole: true,
      unixNewlines: true,
      precision: 8,
      outputStyle: 'nested',
      trace: !B.RELEASE,
      lineNumbers: !B.RELEASE,
      debugInfo: !B.RELEASE
    }))
    .pipe(g.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(g.csscomb())
    .pipe(g.if(B.RELEASE, g.minifyCss()))
    .pipe(gulp.dest('build/staging/components'))
    .pipe(g.size({title: 'styles'}));
});

gulp.task('build.ng', function () {
  src.ngTemplates = ['app/components/**/*.html'];
  return gulp.src(src.ngTemplates)
    .pipe(g.plumber())
    .pipe(g.if(B.RELEASE,g.minifyHtml()))
    .pipe(g.angularTemplateCache({
      module: 'myApp',
      root: '/components/',
      filename: 'templates.js'
    }))
    .pipe(gulp.dest('build/staging'));
});

gulp.task('build.usemin', ['build.ng'], function () {
  src.usemin = ['app/index.html', 'app/components/**/*.js'];
  return gulp.src(['app/index.html'])
    .pipe(g.plumber())
    .pipe(g.usemin(
      {
        css: [g.minifyCss(), 'concat'],
        html: [g.minifyHtml({
          empty: true
        })],
        js: [g.uglify(), g.rev()]
      }))
    .pipe(gulp.dest('build/dist'))
    .pipe(g.size({title: 'usemin'}));
});

gulp.task('serve.prod', ['build.prod'], function (done) {
  http.createServer(
    g.st({path: __dirname + '/build/dist', index: 'index.html', cache: true})
  ).listen(8000, done);
});

gulp.task('serve', function (done) {
  http.createServer(
    g.st({path: __dirname + '/build/dist', index: 'index.html', cache: false})
  ).listen(8000, done);

  g.liveReload.listen({
    basePath: 'build/dist',
    start: true
  });
});

// Build and start watching for modifications
gulp.task('build.watch', ['test.unit'], function (done) {
  var startWatching = function () {
    gulp.watch(src.styles, ['build.styles']);
    gulp.watch(src.ngTemplates, ['build.ng']);
    gulp.watch(src.usemin, ['build.usemin']);
    return done();
  };
  return startWatching();
});

gulp.task('sync', ['serve'], function (done) {
  g.runSequence('build.dev', 'build.watch', done);
});


/**
 *
 */

// karma tests
//     These tests run in the browser and are allowed to access HTML DOM APIs.
function getBrowsersFromCLI() {
  var args = g.minimist(process.argv.slice(2));
  return [args.browsers ? args.browsers : 'PhantomJS'];
}

gulp.task('test.unit', function (done) {
  g.karma.start({configFile: __dirname + '/test/karma.conf.js'});
  return done();
});

gulp.task('test.unit/ci', function (done) {
  g.karma.start({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true, reporters: ['dots'], browsers: getBrowsersFromCLI()
  });
  return done();
});

/**
 * Execute
 */
gulp.task('test.e2e', g.shell.task(['./scripts/ci/e2e.sh']));

gulp.task('clean', function (done) {
  g.del(['build/**/*', '!build/**/.gitkeep'], done);
});


gulp.task('build.dev', function (done) {
  return g.runSequence('build.styles', 'build.ng', 'build.usemin', done);
});

gulp.task('build.prod', function (done) {
  return g.runSequence('build.dev', done);
});

/**
 * Example - Build and run tests against Chrome:
 * gulp build --browsers=${KARMA_BROWSERS:-Chrome}
 */
gulp.task('build', function(done){
  return g.runSequence('build.prod', 'test.unit/ci', done);
});

gulp.task('default', ['build'], function () {

});

