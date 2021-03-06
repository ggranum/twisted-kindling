(function () {
  'use strict';

  // Declare app level module which depends on filters, and services
  var module = angular.module('myApp.config', []);

  // version of this seed app is compatible with angularFire 0.6
  // see tags for other versions: https://github.com/firebase/angularFire-seed/tags
  module.constant('version', '0.0.1');

  // where to redirect users if they need to authenticate (see routeSecurity.js)
  module.constant('loginRedirectPath', '/login');

  // your Firebase data URL goes here, no trailing slash
  module.constant('FBURL', 'https://twisted-kindling.firebaseio.com');

  // double check that the app has been configured before running it and blowing up space and time
  module.run([
    'FBURL', '$timeout', function (FBURL, $timeout) {
      if (FBURL.match('//INSTANCE.firebaseio.com')) {
        angular.element(document.body).html('<h1>Please configure app/components/_base/config.js before running!</h1>');
        $timeout(function () {
          angular.element(document.body).removeClass('hide');
        }, 250);
      }
    }]);

})();