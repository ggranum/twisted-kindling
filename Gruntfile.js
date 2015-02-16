'use strict';
/* global module, require */
module.exports = function (grunt) {

  var appConfig = {
    name: 'myApp',
    devHost: 'localhost',
    devPort: 8000,
    bindHost: '0.0.0.0', /* Bind to all host adaptors - all zeros enables external access. */
    paths: {
      rel: {
        bower: 'bower_components/',
        components: 'components/',
        static: 'static/'
      },
      app: 'app/',
      dist: 'dist/',
      staging: 'staging/',
      test: 'test/'
    },
    debug: {
      /* A 'true' value for any of these debug flags will always _increase_ the debug output. */
      dev: {
        sassTraceEnabled: false,
        sassLineNumbersEnabled: false,
        sassDebugInfoEnabled: false
      },
      dist: {
        sassTraceEnabled: false,
        sassLineNumbersEnabled: false,
        sassDebugInfoEnabled: false,
        expandedDistHtml: true
      }

    },
    /**
     * Passes requests on to an application server (or file server, or whatever) for some assets.
     * For example, if you are consuming ReST data from your own Jetty-based application server you can
     * configure this proxy to forward all requests for '/rest{...}' to be passed to that server.
     *
     * If you're insane you can even point to a production server while developing. But that is
     * truly a bad idea except for a very specific use case: debugging a production issue that can't
     * be reproduced locally.
     */
    proxy: {
      host: 'localhost',
      port: 8001,
      pathToProxy: '/suchAsThePathToYourRestResources'
    }
  };

  appConfig.openToUrl = 'http://' + appConfig.devHost + ':' + appConfig.devPort;
  //appConfig.openToUrl = false;

  appConfig.paths.abs = {
    components: appConfig.paths.app + 'components/',
    static:     appConfig.paths.app + 'static/'
  };

  appConfig.globs = {
    rel: {
      images: ['**/*.{png,jpg,jpeg,ico,gif,bmp}'],
      optimizableImages: [appConfig.paths.rel.static + '**/*.{png,jpg,jpeg,gif}'],
      svgImages: [appConfig.paths.rel.static + '**/*.{svg}'],
      ownHtml: [appConfig.paths.rel.components + '**/*.html', './*.html'],
      allStatic: [appConfig.paths.rel.static + '**/*'],
      allSass: [appConfig.paths.rel.components + '**/*.{scss,_scss}', appConfig.paths.rel.static + '**/*.{scss,_scss}', '*.scss'],
      builtExpandedCss: [appConfig.paths.rel.components + '**/*([^.]).css', '*([^.]).css'],
      builtMinifiedCss: [appConfig.paths.rel.components + '**/*.min.css', '*.min.css']
    },

    specTests: [appConfig.paths.app + '**/*.spec.js'],
    /* 'own' means "You wrote it". As opposed to built it, generated it from a repeatable process, downloaded it, etc. */
    ownHtml: [appConfig.paths.abs.components + '**/*.html', appConfig.paths.app + '*.html'],
    ownJavaScript: [appConfig.paths.abs.components + '**/*([^.]).js', appConfig.paths.app + 'app.js'],
    ownSass: [appConfig.paths.abs.components + '**/*.{scss,_scss}', appConfig.paths.abs.static + '**/*.{scss,_scss}', appConfig.paths.app + '*.scss'],
    allSpecTestJs: [appConfig.paths.abs.components + '**/*.spec.js'],
    builtCSS: [appConfig.paths.staging + appConfig.paths.rel.components + '**/*.{css,map}'],
    allDist: [appConfig.paths.dist + '**/*'],
    /* Files that should be versioned to avoid old versions being loaded by users after a deploy. */
    distCacheable: [appConfig.paths.dist + '**/*.{css,js}']
  };

  appConfig.globs.abs = {
    builtExpandedCss: prefix(appConfig.paths.staging, appConfig.globs.rel.builtExpandedCss)
  };

  function prefix(thePrefix, theAry) {
    return theAry.map(function (value) {
      return thePrefix + value;
    });
  }

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-usemin');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({

    watch: {
      js: {
        options: {
          livereload: false
        },
        files: appConfig.globs.ownJavaScript.concat(appConfig.globs.allSpecTestJs),
        tasks: ['newer:jshint', 'karma:liveDevMode:run']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: appConfig.globs.ownSass,
        tasks: ['sass:dev', 'autoprefixer']
      },
      liveDevMode: {
        options: {
          livereload: true
        },
        files: appConfig.globs.ownHtml.concat(appConfig.globs.ownJavaScript, appConfig.globs.abs.builtExpandedCss)
      }
    },

    /**
     * Configures the server that we use for development and end-to-end testing.
     *
     */
    connect: {
      options: {
        port: appConfig.devPort,
        // Change this to '0.0.0.0' (alias: '*') to access the server from outside
        hostname: appConfig.bindHost
      },
      liveDevMode: {
        options: {
          livereload: true,
          open: appConfig.openToUrl,
          base: [
            appConfig.paths.staging,
            appConfig.paths.app
          ],
          middleware: function (connect, options) {
            if (!Array.isArray(options.base)) {
              options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

            // Serve static files.
            options.base.forEach(function (base) {
              middlewares.push(connect.static(base));
            });

            // Make directory browse-able.
            var directory = options.directory || options.base[options.base.length - 1];
            middlewares.push(connect.directory(directory));

            return middlewares;
          }
        },
        proxies: [
          {
            context: appConfig.proxy.pathToProxy,
            host: appConfig.proxy.host,
            port: appConfig.proxy.port,
            https: false,
            changeOrigin: false,
            xforward: false,
            headers: {
              'x-custom-added-header': 'fake'
            }
          }
        ]
      },
      dist: {
        options: {
          livereload: false,
          base: appConfig.paths.dist
        }
      }
    },

    /**
     *
     */
    clean: {
      everything: [appConfig.globs.builtCSS, appConfig.paths.staging + "**/*", appConfig.paths.dist + '**/*', ".sass-cache", '!**/.gitkeep'],
      dist: [appConfig.paths.staging + "**/*", appConfig.paths.dist + '**/*', '!**/.gitkeep'],
      staging: [appConfig.paths.staging + "**/*", '!**/.gitkeep']
    },

    /**
     *
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js'].concat(appConfig.globs.allSpecTestJs, appConfig.globs.ownJavaScript)
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        unixNewlines: true,
        precision: 8 /* required for SASS. */
      },
      dev: {
        options: {
          sourcemap: 'auto',
          style: 'expanded',
          update: true,
          trace: appConfig.debug.dev.sassTraceEnabled,
          lineNumbers: appConfig.debug.dev.sassLineNumbersEnabled,
          debugInfo: appConfig.debug.dev.sassDebugInfoEnabled
        }, files: [
          {
            expand: true,
            cwd: appConfig.paths.app,
            src: appConfig.globs.rel.allSass,
            dest: appConfig.paths.staging,
            ext: '.css'
          }]
      },
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed',
          update: false,
          trace: appConfig.debug.dist.sassTraceEnabled,
          lineNumbers: appConfig.debug.dist.sassLineNumbersEnabled,
          debugInfo: appConfig.debug.dist.sassDebugInfoEnabled
        }, files: [
          {
            expand: true,
            cwd: appConfig.paths.app,
            src: appConfig.globs.rel.allSass,
            dest: appConfig.paths.staging,
            ext: '.min.css'
          }]
      }
    },

    /**
     * Add vendor prefixed styles (-moz, etc)
     */
    autoprefixer: {
      options: {
        browsers: ['last 10 version']
      },
      all: {
        files: [
          {
            expand: true,
            cwd: appConfig.paths.staging,
            src: appConfig.globs.rel.builtExpandedCss.concat(appConfig.globs.rel.builtMinifiedCss),
            dest: appConfig.paths.staging
          }
        ]
      }
    },

    /**
     * Renames files for browser caching purposes
     */
    rev: {
      dist: {
        files: {
          src: appConfig.globs.distCacheable
        }
      }
    },

    /**
     * Reads index.html (and, if reconfigured, other html files) for usemin blocks, in order to enable smart builds that automatically
     * concat, minify and revision files.
     */
    useminPrepare: {
      options: {
        dest: appConfig.paths.dist
      },
      html: appConfig.paths.app + '**/*.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [appConfig.paths.dist]
      },
      html: [appConfig.paths.dist + '**/*.html'],
      css: appConfig.globs.abs.builtExpandedCss
    },

    /**
     * Optimize JPEGs, GIFs and PNGs. Makes JPEGs and GIFs progressive/interlaced respectively, to enable progressive loading (this is lossless).
     * https://github.com/gruntjs/grunt-contrib-imagemin
     */
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3           /* From 0 to 7, 7 being most intense/expensive. */
        },
        files: [
          {
            expand: true,
            cwd: appConfig.paths.app,
            src: appConfig.globs.rel.optimizableImages,
            dest: appConfig.paths.dist
          }
        ]
      }
    },

    /**
     * Optimize your SVG files.
     * https://github.com/sindresorhus/grunt-svgmin
     */
    svgmin: {
      dist: {
        options: {
          plugins: [
            {removeUselessStrokeAndFill: false}  // don't remove Useless Strokes and Fills (can remove small details)
          ]
        },
        files: [
          {
            expand: true,
            cwd: appConfig.paths.app,
            src: appConfig.globs.rel.svgImages,
            dest: appConfig.paths.dist
          }
        ]
      }
    },

    /**
     * Minimize your HTML for distribution.
     * https://github.com/gruntjs/grunt-contrib-htmlmin
     * https://github.com/kangax/html-minifier
     */
    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: !appConfig.debug.dist.expandedDistHtml,
          collapseWhitespace: !appConfig.debug.dist.expandedDistHtml,
          removeAttributeQuotes: !appConfig.debug.dist.expandedDistHtml,
          removeCommentsFromCDATA: !appConfig.debug.dist.expandedDistHtml,
          removeEmptyAttributes: !appConfig.debug.dist.expandedDistHtml,
          removeOptionalTags: !appConfig.debug.dist.expandedDistHtml,
          removeRedundantAttributes: !appConfig.debug.dist.expandedDistHtml,
          useShortDoctype: !appConfig.debug.dist.expandedDistHtml
        },
        files: [
          {
            expand: true,
            cwd: appConfig.paths.dist,
            src: '**/*.html',
            dest: appConfig.paths.dist
          }
        ]
      }
    },

    /**
     *
     */
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: appConfig.paths.app,
            dest: appConfig.paths.dist,
            src: [
              '**/*.{ico,png,txt,webp}',
              '.htaccess',
              appConfig.globs.rel.ownHtml,
              appConfig.globs.rel.allStatic
            ]
          }
        ]
      }
    },

    /**
     * Create a zip file of the project distribution.
     */
    compress: {
      main: {
        options: {
          archive: appConfig.name + '.zip'
        },
        files: [
          {src: [appConfig.paths.dist + '**'], dest: '/'}
        ]
      }
    },
    //
    //concat: {
    //
    //},

    /**
     *
     */
    karma: {
      liveDevMode: {
        configFile: appConfig.paths.test + 'karma.conf.js',
        background: true,
        singleRun: false,
        browsers: ['PhantomJS']
      }, //continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        configFile: appConfig.paths.test + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },

    protractor: {
      options: {
        configFile: appConfig.paths.test + "protractor-conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {} /* At least one target is required. This simply uses the global options above. */
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      dist: [
        'sass:dev',
        'sass:dist',
        'imagemin',
        'svgmin'
      ]
    }

  });

  /**
   * Builds and Serves the fully built version of the app, using 'appConfig.paths.dist' as the root path.
   */
  grunt.registerTask('serve', ['build', 'connect:dist:keepalive']);

  /**
   * Start the live development mode server:
   * - Connect plugin starts serving, with 'appConfig.paths.app' and 'appConfig.paths.staging' merged into a single 'pseudo' root path.
   * - Watch plugin triggers rebuilds of your SASS files when changed, which are built to your staging directory.
   * - Watch plugin triggers browser refresh on changes to js, html and css files, thanks to the livereload plugin.
   * - Watch plugin triggers jshint and karma test run when source JS files change.
   */
  grunt.registerTask('dev', function (target) {
    grunt.task.run([
      'clean:staging',
      'sass:dev',
      'autoprefixer',
      'configureProxies:liveDevMode',
      'karma:liveDevMode:start',
      'connect:liveDevMode',
      'watch'
    ]);
  });

  grunt.registerTask('e2e', function (target) {
    grunt.task.run([
      'build',
      'connect:dist',
      'protractor'
    ]);
  });

  /**
   * Performs a clean and a full build (minimize, inject, concat, optimize, etc), but runs no tests.
   */
  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  /**
   * Run JSHint, karma tests, do a full build and then package the app into a zip file.
   */
  grunt.registerTask('default', function (target) {

    grunt.task.run([
      'jshint',
      'karma:continuous',
      'build',
      'compress:main'
    ]);
  });
};
