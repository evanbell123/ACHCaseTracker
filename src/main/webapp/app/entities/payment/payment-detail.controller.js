(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('PaymentDetailController', PaymentDetailController);

    PaymentDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Payment'];

    function PaymentDetailController($scope, $rootScope, $stateParams, entity, Payment) {
        var vm = this;
        vm.payment = entity;
        vm.load = function (id) {
            Payment.get({id: id}, function(result) {
                vm.payment = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:paymentUpdate', function(event, result) {
            vm.payment = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
