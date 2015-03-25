(function () {
  "use strict";

  var module = angular.module('myApp.account', ['firebase', 'simpleLogin', 'ngMaterial', 'myApp.core']);
  module.config([
    "$mdThemingProvider", function ($mdThemingProvider) {
      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
    }]);

  var AccountController = function ($rootScope, $firebaseObject, $location, $q, userFactory, simpleLogin) {
    var self = this;
    angular.extend(self, {
      $q: $q,
      $rootScope: $rootScope,
      simpleLogin: simpleLogin,
      userFactory: userFactory,
      profile: undefined,
      err: undefined,
      msg: undefined,
      emailerr: undefined,
      emailmsg: undefined,
      logout: function () {
        simpleLogin.logout();
        self.profile.$destroy();
        $location.path('/login');
      },
      changePassword: function (pass, confirm, newPass) {
        self.clear();
        if (!pass || !confirm || !newPass) {
          self.err = 'Please fill in all password fields';
        }
        else if (newPass !== confirm) {
          self.err = 'New pass and confirm do not match';
        }
        else {
          simpleLogin.changePassword(profile.email, pass, newPass)
            .then(function () {
              self.msg = 'Password changed';
            }, function (err) {
              self.err = err;
            });
        }
      },
      clear: function () {
        self.err = undefined;
        self.msg = undefined;
        self.emailerr = undefined;
        self.emailmsg = undefined;
      },
      changeEmail: function (pass, newEmail) {
        self.clear();
        var oldEmail = self.profile.email;
        simpleLogin.changeEmail(pass, oldEmail, newEmail)
          .then(function (user) {
            self.profile.$destroy();
            self.profile = self.userFactory.current();
            self.profile.$bindTo($rootScope, 'profile');
            self.emailmsg = 'Email changed';
          }, function (err) {
            self.emailerr = err;
          });
      }
    });
  };

  /**
   * Verify that there is a user logged in before allowing the navigation.
   * Note that the URL is NOT reverted if the promise returned by canActivate
   * is rejected.
   * @returns {Promise}
   */
  AccountController.prototype.canActivate = function () {
    var self = this;
    return self.simpleLogin.getUser().then(function (authUser) {
      return authUser == null ? self.$q.reject("User is required.") : true;
    });

  };
  AccountController.prototype.activate = function () {
    var self = this;
    var promise = self.userFactory.current();
    promise.then(function (profile) {
      self.profile = profile;
      self.profile.$bindTo(self.$rootScope, 'profile');
    });
    return promise;
  };
  module.controller('AccountController', ['$rootScope', '$firebaseObject', '$location', '$q', 'userFactory', 'simpleLogin', AccountController]);

}());