(function () {
  "use strict";

angular.module('myApp.home', ['firebase.utils', 'simpleLogin'])
  .controller('HomeCtrl', [
    '$scope', 'fbutil', 'user', 'FBURL', function ($scope, fbutil, user, FBURL) {
      $scope.motd = fbutil.syncObject('motd');
      $scope.user = user;
      $scope.FBURL = FBURL;
    }]);

}());
