(function () {
  "use strict";
  angular.module('myApp.footer', ['ngMaterial'])
    .controller('FooterController', [
      "$scope", "$timeout", "$mdBottomSheet", function ($scope, $timeout, $mdBottomSheet) {
        $scope.alert = '';
        $scope.showGridBottomSheet = function ($event) {
          $scope.alert = '';
          $mdBottomSheet.show({
            templateUrl: '/components/footer/footer.html',
            controller: 'GridBottomSheetCtrl',
            targetEvent: $event
          }).then(function (clickedItem) {
            $scope.alert = clickedItem.name + ' clicked!';
          });
        };
      }])
    .controller('GridBottomSheetCtrl', [
      "$scope", "$mdBottomSheet", function ($scope, $mdBottomSheet) {
        $scope.items = [
          {name: 'Hangout', icon: 'hangout'},
          {name: 'Mail', icon: 'mail'},
          {name: 'Message', icon: 'message'},
          {name: 'Copy', icon: 'copy'},
          {name: 'Facebook', icon: 'facebook'},
          {name: 'Twitter', icon: 'twitter'}
        ];
        $scope.listItemClick = function ($index) {
          var clickedItem = $scope.items[$index];
          $mdBottomSheet.hide(clickedItem);
        };
      }]);

}());
