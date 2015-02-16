'use strict';

describe('login', function(){
  beforeEach(function() {module('myApp.login');});

  describe('ngShowAuth', function () {
    var $q, $timeout, $scope, element, stub;
    beforeEach(function () {
      module(function ($provide) {
        stub = stubSimpleLogin();
        $provide.factory('simpleLogin', function () { return stub; });
      });
      inject(function ($compile, $rootScope, _$q_, _$timeout_) {
        $scope = $rootScope.$new();
        element = $compile('<span ng-show-auth></span>')($scope);
        $q = _$q_;
        $timeout = _$timeout_;
      });
    });

    it('should hide elements initially', function () {
      expect(element.hasClass('ng-cloak')).toBe(true);
    });

    it('should show if logged in after resolve', function () {
      stub.$$notify({uid: 'test123'});
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(false);
    });

    it('should stay hidden if not logged in after resolve', function () {
      stub.$$notify(null);
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(true);
    });

    it('should update if the auth status changes', function () {
      stub.$$notify(null);
      $timeout.flush();
      stub.$$notify({uid: 'test123'});
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(false);
    });
  });

  describe('ngHideAuth', function () {
    var $q, $timeout, $scope, element, stub;
    beforeEach(function () {
      module(function ($provide) {
        stub = stubSimpleLogin();
        $provide.value('simpleLogin', stub);
      });
      inject(function ($compile, $rootScope, _$q_, _$timeout_) {
        $scope = $rootScope.$new();
        element = $compile('<span ng-hide-auth></span>')($scope);
        $q = _$q_;
        $timeout = _$timeout_;
      });
    });

    it('should hide elements initially', function () {
      expect(element.hasClass('ng-cloak')).toBe(true);
    });

    it('should stay hidden if logged in after resolve', function () {
      stub.$$notify({uid: 'test123'});
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(true);
    });

    it('should show if not logged in after resolve', function () {
      stub.$$notify(null);
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(false);
    });

    it('should update if the auth status changes', function () {
      stub.$$notify(null);
      $timeout.flush();
      stub.$$notify({uid: 'test123'});
      $timeout.flush();
      expect(element.hasClass('ng-cloak')).toBe(true);
    });
  });

  function stubSimpleLogin() {
    var listeners = [];
    var obj = jasmine.createSpyObj('simpleLogin', ['watch']);
    obj.watch.andCallFake(function (cb) {
      listeners.push(cb);
    });
    obj.$$notify = function () {
      var args = Array.prototype.slice.call(arguments);
      angular.forEach(listeners, function (fn) {
        fn.apply(null, args);
      });
    };
    return obj;
  }
});
