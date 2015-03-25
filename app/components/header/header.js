(function () {
  "use strict";
  var module = angular.module('myApp.header', ['firebase', 'simpleLogin', 'myApp.core']);

  module.controller('HeaderController', [
    '$mdSidenav', '$log', 'userFactory', function ($mdSidenav, $log, userFactory) {
      var self = this;
      angular.extend(self, {
        toggleRight: function () {
          $mdSidenav('right').toggle().then(function () {
            $log.debug("toggle RIGHT is done");
          });
        }
      });
      userFactory.current().then(function (profile) {
        self.profile = profile;
      });
    }]);

  module.directive('myAppHeader', [
    function () {
      return {
        restrict: 'E',
        templateUrl: '/components/header/header.tpl.html',
        controller: 'HeaderController',
        controllerAs: 'header'
      };
    }]);

}());
