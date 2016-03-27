(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDialogController', ACHCaseDialogController);

    ACHCaseDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'ACHCase'];

    function ACHCaseDialogController ($scope, $stateParams, $uibModalInstance, entity, ACHCase) {
        var vm = this;
        vm.aCHCase = entity;
        vm.load = function(id) {
            ACHCase.get({id : id}, function(result) {
                vm.aCHCase = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:aCHCaseUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.aCHCase.id !== null) {
                ACHCase.update(vm.aCHCase, onSaveSuccess, onSaveError);
            } else {
                ACHCase.save(vm.aCHCase, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.lastPaymentOn = false;
        vm.datePickerOpenStatus.slaDeadline = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
