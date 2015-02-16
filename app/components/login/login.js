(function () {
  "use strict";

angular.module('myApp.login', ['firebase.utils', 'simpleLogin'])
  .config([
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
    }])
/**
 * Wraps ng-cloak so that, instead of simply waiting for Angular to compile, it waits until
 * simpleLogin resolves with the remote Firebase services.
 *
 * <code>
 *    <div ng-cloak>Authentication has resolved.</div>
 * </code>
 */
  .controller('LoginCtrl', [
    '$scope', 'simpleLogin', '$location', function ($scope, simpleLogin, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function (email, pass) {
        $scope.err = null;
        simpleLogin.login(email, pass)
          .then(function (/* user */) {
            $location.path('/account');
          }, function (err) {
            $scope.err = errMessage(err);
          });
      };

      $scope.createAccount = function () {
        $scope.err = null;
        if (assertValidAccountProps()) {
          simpleLogin.createAccount($scope.email, $scope.pass)
            .then(function (/* user */) {
              $location.path('/account');
            }, function (err) {
              $scope.err = errMessage(err);
            });
        }
      };

      function assertValidAccountProps() {
        if (!$scope.email) {
          $scope.err = 'Please enter an email address';
        }
        else if (!$scope.pass || !$scope.confirm) {
          $scope.err = 'Please enter a password';
        }
        else if ($scope.createMode && $scope.pass !== $scope.confirm) {
          $scope.err = 'Passwords do not match';
        }
        return !$scope.err;
      }

      function errMessage(err) {
        return angular.isObject(err) && err.code ? err.code : err + '';
      }
    }])

/**
 * A directive that shows elements only when user is logged in.
 */
  .directive('ngShowAuth', [
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
    }])

/**
 * A directive that shows elements only when user is logged out.
 */
  .directive('ngHideAuth', [
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

