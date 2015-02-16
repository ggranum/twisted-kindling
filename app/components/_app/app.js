(function () {
  "use strict";

  // Declare app level module which depends on filters, and services
  var myApp = angular.module('myApp', [
    'ngMaterial',
    'myApp.routes',
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

  myApp.config(["$mdThemingProvider", function ($mdThemingProvider) {

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('pink');
  }]);

  myApp.controller('AppController',
    ["$scope", "$timeout", "$mdSidenav", "$log", function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle()
        .then(function (foo) {
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
    'fbutil', function (fbutil) {
      return fbutil.syncArray('messages', {limitToLast: 10, endAt: null});
    }]);

  core.factory("userFactory", [
    '$q', 'simpleLogin', 'fbutil', function ($q, simpleLogin, fbutil) {
      function current(){
        var userPromise = simpleLogin.getUser();
        return userPromise.then(function (authUser) {
          var profile;
          if (authUser) {
            // equivalent to calling (assuming you inject all the extra parameters):
            // "profile = $firebase(new $window.Firebase([FBURL, 'users', authUser.uid].join('/'))).$asObject();"
            profile = fbutil.syncObject(['users', authUser.uid]).$loaded();
          } else {
            profile = $q.when(null);
          }
          return profile;
        });
      }
      function getUser(uid){
        return fbutil.syncObject(['users', uid]).$loaded();
      }


      return {
        current: current,
        getUser: getUser
      };
    }]);

  core.filter('interpolate', [
    'version', function (version) {
      return function (text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }]);


}());
