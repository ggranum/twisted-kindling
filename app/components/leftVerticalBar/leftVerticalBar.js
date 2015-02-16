(function () {
  "use strict";

  var leftVerticalBar = angular.module('twisted.components.leftVerticalBar', ['material.core']);

  leftVerticalBar.directive('tkLeftVerticalBar', ['$mdTheming', function ($mdTheming) {

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
