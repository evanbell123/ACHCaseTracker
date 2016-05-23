(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDialogController', ACHCaseDialogController);

    ACHCaseDialogController.$inject = ['$scope', '$uibModalInstance', 'entity', 'ACHCase'];

    function ACHCaseDialogController ($scope, $uibModalInstance, entity, ACHCase) {
        var vm = this;
        vm.ACHCase = entity;
        vm.payments= ACHCase.payments;
        vm.load = function(id) {
            ACHCase.one({id : id}, function(result) {
                    vm.ACHCase = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:ACHCaseUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.ACHCase.id !== null) {
                ACHCase.update(vm.ACHCase, onSaveSuccess, onSaveError);
            } else {
                ACHCase.create(vm.ACHCase, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.slaDeadline = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
