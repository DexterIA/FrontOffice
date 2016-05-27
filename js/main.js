angular.module('CRM', ['ngMaterial', 'ngMessages', 'loginPage'])
  .controller('main', ['$scope', '$mdDialog', '$mdMedia', '$http',
    function ($scope, $mdDialog, $mdMedia, $http) {
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      /**
       * Функция для отображения диалога логина
       * @param ev - event
       */
      $scope.showLoginDialog = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $scope.id = null;
        $scope.showInfo = false;

        $mdDialog.show({
            controller: 'loginPageCtrl',
            templateUrl: 'templates/loginPage.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
          })
          .then(function (answer) {
            $scope.id = answer;
            $scope.loadCustomer();
          });


        $scope.$watch(function () {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
          $scope.customFullscreen = wantsFullScreen === true;
        });

      };

      $scope.loadCustomer = function () {
        var auth = $http.post('http://127.0.0.1:8081/CRM/findClient', {id: $scope.id}),
          orders = $http.post('http://127.0.0.1:8081/CRM/findOrders', {clientId: $scope.id});
        auth.success(function(data) {
          if (data && data[0]){
            $scope.customer = data[0];
            $scope.showInfo = true;
          }
        });
        orders.success(function(data) {
          if (data && data.length && data.length > 0) {
            $scope.customerOrders = data;
          }
        });
      };

    }]);