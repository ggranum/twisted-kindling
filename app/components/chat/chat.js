(function () {
  "use strict";

  var ngModule = angular.module('myApp.chat', ['firebase', 'simpleLogin']);

  var ChatController = function ($rootScope, userFactory, messageListFactory) {
    var self = this;


    angular.extend(self, {
      $rootScope: $rootScope,
      userFactory: userFactory,
      messageListFactory: messageListFactory,
      messages: [],
      applyUserData: function (localMsg) {
        localMsg.avatar = '';
        localMsg.who = '...';
        userFactory.getUserProfile(localMsg.uid).then(function (aProfile) {
          localMsg.who = aProfile.name;
          if (aProfile.avatar === 'default') {
            localMsg.avatar = '/static/images/ngMaterialListDemo_60.jpeg';
          }
          else {
            localMsg.avatar = aProfile.avatar;
          }
        });
      },
      addMessage: function (newMessage) {
        if (newMessage) {
          var remoteMsg = {uid: self.profile.$id, text: newMessage, when: Date.now()};
          messageListFactory.$add(remoteMsg);
        }
      },
      augmentRemoteMessage: function (remoteMsg) {
        var localMsg = angular.extend({}, remoteMsg);
        self.applyUserData(localMsg);
        self.messages.push(localMsg);
        return localMsg;
      },
      toIsoDate: function (millis) {
        return moment(millis).format();
      }
    });

    messageListFactory.$loaded().then(function () {
      angular.forEach(messageListFactory, function (remoteMsg) {
        self.augmentRemoteMessage(remoteMsg);
      });

      messageListFactory.$watch(function (event) {
        self.augmentRemoteMessage(messageListFactory.$getRecord(event.key));
      });
    });

  };

  ChatController.prototype.activate = function () {
    var self = this;
    var promise = self.userFactory.current();
    promise.then(function (profile) {
      profile.$bindTo(self.$rootScope, 'profile');
    });
    return promise;
  };

  ngModule.controller('ChatController', ['$rootScope', 'userFactory', 'messageListFactory', ChatController]);

}());
