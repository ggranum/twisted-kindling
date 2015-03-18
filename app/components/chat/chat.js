(function () {
  "use strict";

  angular.module('myApp.chat', ['firebase', 'simpleLogin'])
    .controller('ChatCtrl', [
      '$scope', 'userFactory', 'messageListFactory', function ($scope, userFactory, messageListFactory) {
        function applyUserData(localMsg) {
          localMsg.avatar = '';
          localMsg.who = '...';
          userFactory.getUser(localMsg.uid).then(function (aProfile) {
            localMsg.who = aProfile.name;
            if (aProfile.avatar === 'default') {
              localMsg.avatar = '/static/images/ngMaterialListDemo_60.jpeg';
            }
            else {
              localMsg.avatar = aProfile.avatar;
            }
          });
        }

        function init() {
          $scope.messages = [];
          function augmentRemoteMessage(remoteMsg) {
            var localMsg = angular.extend({}, remoteMsg);
            applyUserData(localMsg);
            $scope.messages.push(localMsg);
            return localMsg;
          }

          messageListFactory.$loaded().then(function () {
            angular.forEach(messageListFactory, function (remoteMsg) {
              augmentRemoteMessage(remoteMsg);
            });

            messageListFactory.$watch(function (event) {
              augmentRemoteMessage(messageListFactory.$getRecord(event.key));
            });
          });

          $scope.addMessage = function (newMessage) {
            if (newMessage) {
              var remoteMsg = {uid: $scope.profile.$id, text: newMessage, when: Date.now()};
              messageListFactory.$add(remoteMsg);
            }
          };
          $scope.toIsoDate = function(millis){
            return moment(millis).format();
          };
        }

        userFactory.current().then(function (profile) {
          profile.$bindTo($scope, 'profile');
          init();
        });

      }]);

}());
