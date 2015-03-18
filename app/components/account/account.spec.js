(function () {
  "use strict";

describe('account', function(){
  beforeEach(function() {
    module('mock.firebase');
    module('myApp.account');
  });

  describe('AccountController', function() {
    var account, $scope;
    beforeEach(function() {
      module(function($provide) {
        // comes from routes.js in the resolve: {} attribute
        $provide.value('user', {uid: 'test123'});
      });
      inject(function($controller) {
        account = $controller('AccountController', {});
      });
    });

    it('should define logout method', function() {
      expect(account.logout).toBeA('function');
    });

    it('should define changePassword method', function() {
      expect(account.changePassword).toBeA('function');
    });

    it('should define changeEmail method', function() {
      expect(account.changeEmail).toBeA('function');
    });

    it('should define clear method', function() {
      expect(account.clear).toBeA('function');
    });
  });
});

}());
