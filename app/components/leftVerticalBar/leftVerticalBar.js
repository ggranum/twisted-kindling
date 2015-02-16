(function () {
  "use strict";

  var leftVerticalBar = angular.module('myApp.leftVerticalBar', ['material.core']);

  leftVerticalBar.directive('myAppLeftVerticalBar', ['$mdTheming', function ($mdTheming) {

      return {
        restrict: 'E',
        templateUrl: '/components/leftVerticalBar/leftVerticalBar.html',
        transclude: false,
        link: linkFn,
        scope: {
          segmentClassNames: '=',
          autoHeight: '='
        }
      };
      function linkFn(scope, element, attr) {
        $mdTheming(element);
      }

    }]);

}());
