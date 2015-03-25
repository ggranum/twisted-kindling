/*
 global require
 */
'use strict';

var gulp = require('gulp');
var http = require('http');
var g = {
  angularTemplateCache: require('gulp-angular-templatecache'),
  autoprefixer: require('gulp-autoprefixer'),
  csscomb: require('gulp-csscomb'),
  debug: require('gulp-debug'),
  del: require('del'),
  gutil: require('gulp-util'),
  if: require('gulp-if'),
  minifyCss: require('gulp-minify-css'),
  minifyHtml: require('gulp-minify-html'),
  plumber: require('gulp-plumber'),
  rev: require('gulp-rev'),
  runSequence: require('run-sequence'),
  sass: require('gulp-sass'),
  size: require('gulp-size'),
  sourcemaps: require('gulp-sourcemaps'),
  st: require('st'),
  liveReload: require('gulp-livereload'),
  uglify: require('gulp-uglify'),
  usemin: require('gulp-usemin')

};

var B = {
  RELEASE: false
};

var AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
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

var src = {};

gulp.task('build.images', function(){
  src.images = ['app/bower_components/material-design-icons/sprites/svg-sprite/*.svg'];
  return gulp.src(src.images)
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
    .pipe(g.minifyHtml())
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
        html: [g.minifyHtml({empty: true})],
        js: [g.uglify(), g.rev()]
      }))
    .pipe(gulp.dest('build/dist'))
    .pipe(g.size({title: 'usemin'}));

});

var watch = false;
var browserSync;

gulp.task('server', function (done) {
  http.createServer(
    g.st({path: __dirname + '/build/dist', index: 'index.html', cache: false})
  ).listen(8000, done);

  g.liveReload.listen({
    basePath: 'build/dist',
    start: true
  });
});

// Build and start watching for modifications
gulp.task('build.watch', function (done) {
  watch = true;
  var startWatching = function () {
    gulp.watch(src.styles, ['build.styles']);
    gulp.watch(src.ngTemplates, ['build.ng']);
    gulp.watch(src.usemin, ['build.usemin']);
    done();
  };
  startWatching();
});

gulp.task('sync', ['server', 'build.watch'], function (done) {
  g.runSequence('build.dev', 'build.watch', done);
});



gulp.task('clean', function (done) {
  g.del(['build/**/*', '!build/**/.gitkeep'], done);
});

gulp.task('default', function () {

});

gulp.task('build.dev', function (done) {
  g.runSequence('build.styles', 'build.ng', 'build.usemin', done);
});

gulp.task('build.prod', function (done) {
  g.runSequence('build.dev', done);
});

gulp.task('build', ['build.prod']);



