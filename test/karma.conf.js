module.exports = function(config){
  config.set({
    logLevel: 'INFO',
    basePath : '../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-aria/angular-aria.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-material/angular-material.js',
      'app/bower_components/mockfirebase/browser/mockfirebase.js',
      'app/bower_components/angularfire/dist/angularfire.js',
      'test/lib/**/*.js',
      'app/components/_app/app.js',
      'app/components/_app/config.js',
      'app/components/_app/routes.js',
      /* Files are imported/included in the order found by these globs, and multi-match globs are resolved in alphabetical order.
      * Resolve order conflicts by specifically including the js file that needs to be loaded first above this comment. */
      'app/components/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
