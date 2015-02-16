(function () {
  "use strict";

describe('home', function(){
  beforeEach(function() {
    module('mock.firebase');
    module('myApp.home');
  });

  describe('HomeCtrl', function() {
    var homeCtrl, $scope;
    beforeEach(function() {
      module(function($provide) {
        // comes from routes.js in the resolve: {} attribute
        $provide.value('user', {uid: 'test123'});
      });
      inject(function($controller) {
        $scope = {};
        homeCtrl = $controller('HomeCtrl', {$scope: $scope});
      });
    });

    it('should create user in scope', function() {
      expect($scope.user).toBeDefined();
    });
  });

});

}());
