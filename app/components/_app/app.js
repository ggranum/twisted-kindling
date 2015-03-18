(function () {
  "use strict";

  // Declare app level module which depends on filters, and services
  var myApp = angular.module('myApp', [
    'ngNewRouter',
    'ngAria',
    'ngMaterial',
    'myApp.config',
    'myApp.home',
    'myApp.leftVerticalBar',
    'myApp.footer',
    'myApp.header',
    'myApp.mainMenu',
    'myApp.core',
    'myApp.account',
    'myApp.login',
    'myApp.chat'
  ]);

  myApp.config([
    "$mdThemingProvider", function ($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('pink');
    }]);

  myApp.controller('AppController', [
    "$mdSidenav", "$log", function ($mdSidenav, $log) {
      var app = this;
      app.toggleRight = function () {
        $mdSidenav('right').toggle().then(function () {
            $log.debug("toggle RIGHT is done");
          });
      };
    }]);

  var core = angular.module('myApp.core', []);

  core.directive('appVersion', [
    'version', function (version) {
      return function (scope, elm) {
        elm.text(version);
      };
    }]);

  core.factory('messageListFactory', [
    '$firebaseArray', 'FBURL', function ($firebaseArray, FBURL) {
      return $firebaseArray(new Firebase(FBURL + '/messages').limitToLast(10).endAt(null));
    }]);

  core.factory("userFactory", [
    '$q', 'simpleLogin', '$firebaseObject', 'FBURL', function ($q, simpleLogin, $firebaseObject, FBURL) {
      var self = this;
      angular.extend(self,
        {
          current: function () {
            return simpleLogin.getUser().then(function (authUser) {
              if (authUser) {
                return self.getUserProfile(authUser.uid);
              } else {
                return $q.when(null);
              }
            });
          },
          getUserProfile: function (uid) {
            return $firebaseObject(new Firebase(FBURL + '/users/' + uid)).$loaded();
          }
        });
      return self;
    }]);

  core.filter('interpolate', [
    'version', function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }]);

}());
