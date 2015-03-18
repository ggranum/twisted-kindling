(function () {
  "use strict";

  var module = angular.module('myApp.home', ['firebase', 'simpleLogin', 'myApp.config']);

  var HomeController = function ($firebaseObject, simpleLogin, FBURL) {
    var self = this;
    self.simpleLogin = simpleLogin;
    self.foo = 100;
    self.motd = $firebaseObject(new Firebase(FBURL + '/motd'));
    self.FBURL = FBURL;
  };

  HomeController.prototype.activate = function(){
    var self = this;
    self.user = self.simpleLogin.getUser();
    return self.user;

  };

  module.controller('HomeController', ['$firebaseObject', 'simpleLogin', 'FBURL', HomeController]);


}());
