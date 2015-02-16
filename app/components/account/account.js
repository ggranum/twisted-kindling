(function () {
  "use strict";

  var module = angular.module('myApp.account', ['firebase.utils', 'simpleLogin', 'ngMaterial']);
  module.config([
    "$mdThemingProvider", function ($mdThemingProvider) {
      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
    }]);
  module.controller('AccountCtrl', [
    '$scope', 'simpleLogin', 'fbutil', 'user', '$location',
    function ($scope, simpleLogin, fbutil, user, $location) {
      // create a 3-way binding with the user profile object in Firebase
      var profile = fbutil.syncObject(['users', user.uid]);
      profile.$bindTo($scope, 'profile');

      // expose logout function to scope
      $scope.logout = function () {
        simpleLogin.logout();
        profile.$destroy();
        $location.path('/login');
      };

      $scope.changePassword = function (pass, confirm, newPass) {
        resetMessages();
        if (!pass || !confirm || !newPass) {
          $scope.err = 'Please fill in all password fields';
        }
        else if (newPass !== confirm) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          simpleLogin.changePassword(profile.email, pass, newPass)
            .then(function () {
              $scope.msg = 'Password changed';
            }, function (err) {
              $scope.err = err;
            });
        }
      };

      $scope.clear = resetMessages;

      $scope.changeEmail = function (pass, newEmail) {
        resetMessages();
        var oldEmail = profile.email;
        simpleLogin.changeEmail(pass, oldEmail, newEmail)
          .then(function (user) {
            profile.$destroy();
            profile = fbutil.syncObject(['users', user.uid]);
            profile.$bindTo($scope, 'profile');
            $scope.emailmsg = 'Email changed';
          }, function (err) {
            $scope.emailerr = err;
          });
      };

      function resetMessages() {
        $scope.err = null;
        $scope.msg = null;
        $scope.emailerr = null;
        $scope.emailmsg = null;
      }
    }
  ]);

}());
