(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('PaymentDialogController', PaymentDialogController);

    PaymentDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Payment'];

    function PaymentDialogController ($scope, $stateParams, $uibModalInstance, entity, Payment) {
        var vm = this;
        vm.payment = entity;
        vm.load = function(id) {
            Payment.get({id : id}, function(result) {
                vm.payment = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:paymentUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.payment.id !== null) {
                Payment.update(vm.payment, onSaveSuccess, onSaveError);
            } else {
                Payment.save(vm.payment, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.effectiveOn = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
