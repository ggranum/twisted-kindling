(function () {
  "use strict";

  var module = angular.module('myApp');

  module.config([
    '$componentLoaderProvider', function ($componentLoaderProvider) {
      /**
       * Replace the './components' that is the default with just '/components'. Because NodeJS automagically strips 'pointless' relative
       * paths, which breaks the gulp-angular-templates plugin.
       */
      $componentLoaderProvider.setTemplateMapping(function (name) {
        var dashName = dashCase(name);
        return '/components/' + dashName + '/' + dashName + '.html';
      });

    }]);
  module.controller('AppController', ['$router', function($router){
    $router.config([
      {path: '/', redirectTo: '/home'},
      {path: '/home', component: 'home'},
      {path: '/chat', component: 'chat'},
      {path: '/login', component: 'login'},
      {path: '/account', component: 'account'}
    ]);
  }]);

}());