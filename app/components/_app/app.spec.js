(function () {
  "use strict";

  describe('core', function () {
    beforeEach(module('myApp.core'));

    describe('app-version', function () {
      it('should print current version', function () {
        module(function ($provide) {
          $provide.constant('version', 'TEST_VER');
        });
        inject(function ($compile, $rootScope) {
          var element = $compile('<span app-version></span>')($rootScope);
          expect(element.text()).toEqual('TEST_VER');
        });
      });
    });

    describe('interpolate', function () {
      beforeEach(module(function ($provide) {
        $provide.value('version', 'TEST_VER');
      }));

      it('should replace VERSION', inject(function (interpolateFilter) {
        expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
      }));
    });


  });
}());
