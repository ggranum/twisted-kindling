(function () {
  "use strict";

angular.module('myApp.home', ['firebase', 'simpleLogin', 'myApp.config'])
  .controller('HomeCtrl', [
    '$scope', '$firebaseObject', 'user', 'FBURL', function ($scope, $firebaseObject, user, FBURL) {
      $scope.motd = $firebaseObject(new Firebase( FBURL + '/motd'));
      $scope.user = user;
      $scope.FBURL = FBURL;
    }]);

}());
