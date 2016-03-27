(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('BeneficiaryDialogController', BeneficiaryDialogController);

    BeneficiaryDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Beneficiary'];

    function BeneficiaryDialogController ($scope, $stateParams, $uibModalInstance, entity, Beneficiary) {
        var vm = this;
        vm.beneficiary = entity;
        vm.load = function(id) {
            Beneficiary.get({id : id}, function(result) {
                vm.beneficiary = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:beneficiaryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.beneficiary.id !== null) {
                Beneficiary.update(vm.beneficiary, onSaveSuccess, onSaveError);
            } else {
                Beneficiary.save(vm.beneficiary, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.dateOfDeath = false;
        vm.datePickerOpenStatus.dateCBAware = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
