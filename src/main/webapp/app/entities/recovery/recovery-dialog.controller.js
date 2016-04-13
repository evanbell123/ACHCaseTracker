(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('RecoveryDialogController', RecoveryDialogController);

    RecoveryDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Recovery'];

    function RecoveryDialogController ($scope, $stateParams, $uibModalInstance, entity, Recovery) {
        var vm = this;
        vm.recovery = entity;
        vm.load = function(id) {
            Recovery.get({id : id}, function(result) {
                vm.recovery = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:recoveryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.recovery.id !== null) {
                Recovery.update(vm.recovery, onSaveSuccess, onSaveError);
            } else {
                Recovery.save(vm.recovery, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
