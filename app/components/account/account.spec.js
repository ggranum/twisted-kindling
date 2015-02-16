(function () {
  "use strict";

describe('account', function(){
  beforeEach(function() {
    module('mock.firebase');
    module('myApp.account');
  });

  describe('AccountCtrl', function() {
    var acctCtrl, $scope;
    beforeEach(function() {
      module(function($provide) {
        // comes from routes.js in the resolve: {} attribute
        $provide.value('user', {uid: 'test123'});
      });
      inject(function($controller) {
        $scope = {};
        acctCtrl = $controller('AccountCtrl', {$scope: $scope});
      });
    });

    it('should define logout method', function() {
      expect($scope.logout).toBeA('function');
    });

    it('should define changePassword method', function() {
      expect($scope.changePassword).toBeA('function');
    });

    it('should define changeEmail method', function() {
      expect($scope.changeEmail).toBeA('function');
    });

    it('should define clear method', function() {
      expect($scope.clear).toBeA('function');
    });
  });
});

}());
