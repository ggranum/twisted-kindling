(function () {
  "use strict";
  var module = angular.module('myApp.header', ['firebase.utils', 'simpleLogin']);

  module.controller('HeaderMenuController', [
    '$scope', 'fbutil', 'userFactory', function ($scope, fbutil, userFactory) {
      userFactory.current().then(function (profile) {
        if (profile) {
          profile.$bindTo($scope, 'profile');
        }
      });
    }]);

  module.directive('myAppHeader', [
    function () {
      return {
        restrict: 'E',
        templateUrl: '/components/header/header.html',
        controller: 'HeaderMenuController',
        transclude: false
      };
    }]);

}());
