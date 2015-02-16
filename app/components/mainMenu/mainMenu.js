(function () {
  "use strict";
  var module = angular.module('myApp.mainMenu', ['ngMaterial']);

  module.controller('MainMenuController', [
    "$scope", "$timeout", "$mdSidenav", "$log", function ($scope, $timeout, $mdSidenav, $log) {
      $scope.sidebarId = 'right';
      $scope.items = [
        {name: 'Login', icon: 'input'},
        {name: 'Home', icon: 'home'},
        {name: 'Chat', icon: 'chat'},
        {name: 'Share', icon: 'share'},
        {name: 'Upload', icon: 'cloud_upload'},
        {name: 'Copy', icon: 'content_copy'},
        {name: 'Print this page', icon: 'print'}
      ];
      $scope.items.forEach(function (item) {
        item.iconClass = 'svg-ic_' + item.icon + '_24px';
      });
      $scope.menuItemClick = function ($index) {
        var clickedItem = $scope.items[$index];
        $log.debug("Menu item clicked.", clickedItem);

        $mdSidenav($scope.sidebarId).close(clickedItem);
      };
      $scope.close = function () {
        $mdSidenav($scope.sidebarId).close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
      };
    }]);

  module.directive('mainMenu', [function () {
      return {
        restrict: 'E',
        templateUrl: '/components/mainMenu/mainMenu.html',
        controller: 'MainMenuController',
        transclude: false,
        scope: {
          menuItems: '='
        }
      };
    }]);

}());
