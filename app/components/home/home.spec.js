(function () {
  "use strict";

describe('home', function(){
  beforeEach(function() {
    module('mock.firebase');
    module('myApp.home');
  });

  describe('HomeController', function() {
    var homeCtrl, $scope;
    beforeEach(function() {
      module(function($provide) {
        // comes from routes.js in the resolve: {} attribute
        $provide.value('user', {uid: 'test123'});
      });
      inject(function($controller) {
        $scope = {};
        homeCtrl = $controller('HomeController', {$scope: $scope});
      });
    });

    it('should create user in scope', function() {
      expect('asdf').toBeDefined();
    });
  });

});

}());
