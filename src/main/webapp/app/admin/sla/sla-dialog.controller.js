(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('SLADialogController', SLADialogController);

    SLADialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'SLA'];

    function SLADialogController ($scope, $stateParams, $uibModalInstance, entity, SLA) {
        var vm = this;
        vm.SLA = entity;
        vm.load = function(id) {
            SLA.get({id : id}, function(result) {
                vm.SLA = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:sLAUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.SLA.id !== null) {
                SLA.update(vm.SLA, onSaveSuccess, onSaveError);
            } else {
                SLA.save(vm.SLA, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
