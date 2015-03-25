# Twisted-Kindling: An Angular+AngularFire+Material Design starter of fires.

This seed project extends the (excellent) [angularfire-seed][AngularFire-Seed] project created by the AngularFire team.

What's different? Well, start by checking out the [demo][demo].



# Features

 - Angular 1.4 + New Router
 - Swap out the NPM build targets for Gulp, including SASS, minification, linting, Live-Reload and more.
 - Component Oriented: the file system is aligned with how you develop your app, not Angular nouns. Currently this seed doesn't use nested directories
 under the primary 'components' directory, but it should be possible to augment the build system to handle it fairly easily. Consider it a todo item.
 - Angular Material Design.
 - More fully functional authentication and user profile model.

## Component Oriented build and file system

Rather than group project files by what their function is (controller, view, model, service) we
group the file structure by component:

    app/                                       --> all of the files to be used in production
      bower_components/ {...}                  --> Third party libraries
      components/                              --> Your application views / widgets / components / partials
        _app/                                  --> Primary configuration and shared globals, such as filters
          app.js                               -->
          app.scss                              -> Primary SCSS source. Import all components, etc.
          app.spec.js                          --> Unit tests for 'base'
          config.js                            --> A configuration module
          config.spec.js                       -->
          routes.js                            --> Route configuration for the entire application.
          _palette.scss                        --> Your configure the color palette for your application's CSS.
          _variables.scss                      --> Configure your SCSS variables, such as proportional widths, heights etc.
        _twistedKindling/                      --> Supporting code that you aren't expected to need to edit. (this may become a separate bower project)
          _twisted_kindling.scss               --> Import this file in your primary scss file (see app.scss).
          _materialDesignHacks.scss/           --> Workarounds for issues found in the material design styles. See comments in the file.
          _tk-components.scss                  -->
          _tk-defaults.scss                    -->
          _tk-material-design-palette.scss     -->
          _tk-palette.scss                     -->
          twistedKindling.js                   --> The main Angular module for twistedKindling. Does nothing, actually. Something to @revisit
        account/                               --> The Account view and module. Change account username, email and password. P
          account.html                         -->
          account.js                           -->
          account.spec.js                      -->
          changeEmail.js                       -->
        chat/                                  --> The Chat view and module.
          _chat.scss                           -->
          chat.html                            -->
          chat.js                              -->
          chat.spec.js                         -->
        footer/                                --> A wrapper around MD's 'BottomSheet'.
        header/                                --> A global header, with title and nav menu.
        home/                                  --> The Home page view and module. Show Message of the Day. Part of 'myApp'.
          home.html                            -->
          home.js                              -->
          home.spec.js                         -->
        leftVerticalBar/                       --> Color bar widget for the left side of the app. Common in a number of mobile apps.
        login/                                 --> The Login view and module, and some firebase specific adaptors for 'SimpleLogin' functionality.
          login.html                           -->
          login.js                             -->
          login.spec.js                        -->
          simpleLogin.js                       -->
          simpleLogin.spec.js                  -->
        mainMenu/                              --> Currently implemented as a Material Design right-nav, will be updated once MD releases a Menu component.
      app.iml                                  --> IntelliJ project file.
      index.html                               --> app layout file (the main html template file of the app)
      index-async.html                         --> Not supported! But maybe one day. Supposed to be just like index.html, but loading js files asynchronously.
    test/                                      --> test config and source files
      protractor-conf.js                       --> config file for running e2e tests with Protractor
      e2e/                                     --> end-to-end specs
        scenarios.js
      karma.conf.js                            --> config file for running unit tests with Karma

### Reasoning
The future of web development is heading towards componentization at a fairly rapid clip.
There are very sound reasons for this. In particular, keeping all assets associated with one and
only one component (such as a view) 'near to' one another lends to easier editing of that asset.

Editing of assets is simplified, in a variety of ways. From reducing the chance of developers stepping
on each others edits in a multi-developer environment, to simply reducing the amount of mental overhead
required to keep track of which code is and is not related to the widget under edit. File sizes
typically shrink on average, which also tends to lend to a reduced mental overhead.

## Other changes to original seed project:
I've removed most of the npm hooks in favor of the Gulp build tasks.

IntelliJ project files have been committed, because this fork is mostly for me, and I like it that way :~)

Gulp. This seed project expands on (and replaces) the basic npm driven run targets, adding livereload,
minification (html, JS and CSS), linting, SASS compilation, image optimization... "the works".


At the bottom of the file you will find the build targets. The three main targets are:

```
gulp
```

The default build - no task, no targets passed on command line. This performs all build and package tasks.
Which is to say, it is a "full build".
Your entire site will be built into the 'build/dist' directory (short for 'distribution'), ready to be deployed
via firebase.json. The 'dist' directory is also compressed into a zip archive which is by default stored
in the root project directory and is named 'myApp.zip'.

```
gulp test.e2e
```

Starts a server, runs the end-to-end tests using Protractor and then stops the server. This may cause a browser to open and
close a few times.

```
gulp sync
```

This is where you'll live most of the time. The command will open a browser and start watching your source files. 
Changes to your source SCSS files will trigger a SASS compile, which will in turn cause the livereload plugin to trigger a browser refresh. 
Changes to JS files will trigger JSHint and Karma to re-run, and also will trigger a browser refresh. Ditto modifications to HTML files.
Changes to your bower_components directory are NOT monitored, so be sure to stop and restart after adding new dependencies.


## Future maintenance of this branch
This fork is unlikely to pull in updates from the main angularfire-seed repo, due to the scope of
the difference in file structure. Unless some great level of interest arises it is unlikely that this
fork will see much development beyond these few initial changes I have made.


## Thanks Angular and Firebase Teams!


# twisted-kindling — the component-oriented seed for Angular+Firebase apps

This derivative of [angular-seed](https://github.com/angular/angular-seed) is an application 
skeleton for a typical [AngularFire](http://angularfire.com/) web app, modified to put focus on
component-based development. You can use it to quickly bootstrap your Angular + Firebase projects.

The seed is preconfigured to install the Angular framework, Firebase, AngularFire, and a bundle of
development and testing tools. The application is built using Gulp, which is a significant departure
from the parent projects.

The seed app doesn't do much, but does demonstrate the basics of Angular + Firebase development,
including:
 * binding synchronized objects
 * binding synchronized arrays
 * authentication
 * the new angular router, including route security
 * basic account management using Firebase


## How to use twisted-kindling

Other than one additional configuration step (specifying your Firebase URL), this setup is nearly
identical to angular-seed.

### Prerequisites

You need git to clone the angularfire-seed repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test angularfire-seed. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone twisted-kindling

Clone the twisted-kindling repository using [git][git]:

```
git clone https://github.com/ggranum/twisted-kindling.git
cd twisted-kindling
```

### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

Simply run the following commands from your command line:

```
npm install
bower install
```

You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
twisted-kindling changes this location through the `.bowerrc` file.  Putting it in the app folder makes
IntelliJ happier, as paths can all be resolved, even during development.*

### Configure the Application

 1. Open `app/js/config.js` and set the value of FBURL constant to your Firebase URL
 1. Go to your Firebase dashboard and enable email/password authentication under the Simple Login tab
 1. Copy/paste the contents of `config/security-rules.json` into your Security tab, which is also under your Firebase dashboard.

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
gulp sync
```

Then open a browser to `http://localhost:8000/`, to load your index.html file. Gulp-watch will monitor your html, css and js
files for changes, refreshing your the browser and running jshint and karma when modifications are made.

## Testing

There are two kinds of tests in the twisted-kindling application: Unit tests and End to End tests.

### Running Unit Tests

The angularfire-seed app comes preconfigured with unit tests. These are written in
[Jasmine][jasmine], which we run with the [Karma Test Runner][karma]. We provide a Karma
configuration file to run them.

* the configuration is found at `test/karma.conf.js`
* the unit tests are found beside the components that they test, such as `components/account/account.spec.js`

The easiest way to run unit tests is to enter live development mode with gulp, which will run
Karma tests when source or test javascript files are modified. Live development mode also runs
jshint and refreshes your browser on changes to monitored source files.

```
gulp sync
```

This Gulp task will start the Karma test runner to execute the unit tests. Moreover, Karma (via Gulp Watch)
will sit and watch the source and test files for changes and then re-run the tests whenever any of them change.
This is the recommended strategy; if your unit tests are being run every time you save a file then
you receive instant feedback on any changes that break the expected code functionality.

You can also ask Karma to do a single run of the tests and then exit. This is useful if you want to
check that a particular version of the code is operating as expected. The Gulp build contains a
predefined task to do this:

```
gulp test.unit/ci
```

As you can probably guess from the name, this is a task target that can also used to run tests on our continuous
integration server.

### End to end testing

The twisted-kindling app comes with end-to-end tests, again written in [Jasmine][jasmine]. These tests
are run with the [Protractor][protractor] End-to-End test runner.  It uses native events and has
special features for Angular applications.

* the configuration is found at `test/protractor.conf.js`
* the end-to-end tests are found in `test/e2e/`

Protractor simulates interaction with our web app and verifies that the application responds
correctly. Therefore, our web server needs to be serving up the application, so that Protractor
can interact with it - which a shell script will handle for us, at least if we're on a real OS ;~).


```bash
gulp test.e2e
```

This will start a server by executing the `gulp server.prod` task, and then will execute Protractor scenarios by calling `npm run protractor`.
Technically, the test.e2e tasks calls a shell script which does the above. So if you are on windows, see the next section.
  
#### E2E on Windows
If you're on Windows you can perform these steps manually, but do watch out for servers that don't shut down properly.

First, update the webdriver by running the node script:

```
npm run update-webdriver
```

This downloads and install the latest version of the WebDriver tool.

Once you have updated WebDriver, you can start a server using the supplied gulp task:

```
gulp server.prod
```

Then run execute the protractor test by executing the node script:
 ```
 npm run protractor
 ```


Enjoy!


## Updating Dependencies


You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular, Firebase, AngularFire and myriad other dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.

### Running the App in Production

This really depends on how complex is your app and the overall infrastructure of your system, but
the general rule is that all you need in production are all the files under the `/build/dist/` directory. 
After calling 'gulp build', of course.
Everything else should be omitted.

Angular/Firebase apps are really just a bunch of static html, css and js files that just need to be hosted
somewhere they can be accessed by browsers.

## Continuous Integration

### Travis CI
 (Untested for twisted-kindling)
[Travis CI][travis] is a continuous integration service, which can monitor GitHub for new commits
to your repository and execute scripts such as building the app or running tests. The angularfire-seed
project contains a Travis configuration file, `.travis.yml`, which will cause Travis to run your
tests when you push to GitHub.

You will need to enable the integration between Travis and GitHub. See the Travis website for more
instruction on how to do this.

### CloudBees
(Untested for twisted-kindling)
CloudBees have provided a CI/deployment setup:

<a href="https://grandcentral.cloudbees.com/?CB_clickstart=https://raw.github.com/CloudBees-community/angular-js-clickstart/master/clickstart.json">
<img src="https://d3ko533tu1ozfq.cloudfront.net/clickstart/deployInstantly.png"/></a>

If you run this, you will get a cloned version of this repo to start working on in a private git repo,
along with a CI service (in Jenkins) hosted that will run unit and end to end tests in both Firefox and Chrome.


## Contact

For more information on Firebase and AngularFire, 
check out https://firebase.com/docs/web/bindings/angular

For more information on AngularJS please check out http://angularjs.org/

[angularfire-seed]: https://github.com/firebase/angularfire-seed
[git]: http://git-scm.com/
[demo]: http://twisted-kindling.firebaseio.com
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[jasmine]: http://jasmine.github.io/1.3/introduction.html
[karma]: http://karma-runner.github.io
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server
