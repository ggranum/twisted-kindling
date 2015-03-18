(function () {
  "use strict";

  var ngModule = angular.module('myApp.login', ['firebase', 'simpleLogin']);
  ngModule.config([
    '$provide', function ($provide) {
      // adapt ng-cloak to wait for auth before it does its magic
      $provide.decorator('ngCloakDirective', [
        '$delegate', 'simpleLogin',
        function ($delegate, simpleLogin) {
          var directive = $delegate[0];
          // make a copy of the old directive
          var _compile = directive.compile;
          directive.compile = function (element, attr) {
            simpleLogin.getUser().then(function () {
              // after auth, run the original ng-cloak directive
              _compile.call(directive, element, attr);
            });
          };
          // return the modified directive
          return $delegate;
        }]);
    }]);

  ngModule.controller('LoginController', [
    'simpleLogin', '$location', function (simpleLogin, $location) {
      var self = this;

      angular.extend(self, {
        email: null,
        pass: null,
        confirm: null,
        createMode: false,
        performLogin: function () {

          self.err = null;
          simpleLogin.login(self.email, self.pass)
            .then(function (/* user */) {
              $location.path('/account');
            }, function (err) {
              self.err = self.errMessage(err);
            });
        },
        createAccount: function () {
          self.err = null;
          if (self.assertValidAccountProps()) {
            simpleLogin.createAccount(self.email, self.pass)
              .then(function (/* user */) {
                $location.path('/account');
              }, function (err) {
                self.err = self.errMessage(err);
              });
          }
        },
        assertValidAccountProps: function () {
          if (!self.email) {
            self.err = 'Please enter an email address';
          }
          else if (!self.pass || !self.confirm) {
            self.err = 'Please enter a password';
          }
          else if (self.createMode && self.pass !== self.confirm) {
            self.err = 'Passwords do not match';
          }
          return !self.err;
        },
        errMessage: function (err) {
          return angular.isObject(err) && err.code ? err.code : err + '';
        }
      });



    }]);

  /**
   * A directive that shows elements only when user is logged in.
   */
  ngModule.directive('ngShowAuth', [
    'simpleLogin', '$timeout', function (simpleLogin, $timeout) {
      var isLoggedIn;
      simpleLogin.watch(function (user) {
        isLoggedIn = !!user;
      });

      return {
        restrict: 'A',
        link: function (scope, el) {
          el.addClass('ng-cloak'); // hide until we process it

          function update() {
            // sometimes if ngCloak exists on same element, they argue, so make sure that
            // this one always runs last for reliability
            $timeout(function () {
              el.toggleClass('ng-cloak', !isLoggedIn);
            }, 0);
          }

          update();
          simpleLogin.watch(update, scope);
        }
      };
    }]);

  /**
   * A directive that shows elements only when user is logged out.
   */
  ngModule.directive('ngHideAuth', [
    'simpleLogin', '$timeout', function (simpleLogin, $timeout) {
      var isLoggedIn;
      simpleLogin.watch(function (user) {
        isLoggedIn = !!user;
      });

      return {
        restrict: 'A',
        link: function (scope, el) {
          function update() {
            el.addClass('ng-cloak'); // hide until we process it

            // sometimes if ngCloak exists on same element, they argue, so make sure that
            // this one always runs last for reliability
            $timeout(function () {
              el.toggleClass('ng-cloak', isLoggedIn !== false);
            }, 0);
          }

          update();
          simpleLogin.watch(update, scope);
        }
      };
    }]);

}());

