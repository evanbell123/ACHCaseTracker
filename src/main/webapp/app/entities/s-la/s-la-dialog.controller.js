(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('SLADialogController', SLADialogController);

    SLADialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'SLA'];

    function SLADialogController ($scope, $stateParams, $uibModalInstance, entity, SLA) {
        var vm = this;
        vm.sLA = entity;
        vm.load = function(id) {
            SLA.get({id : id}, function(result) {
                vm.sLA = result;
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
            if (vm.sLA.id !== null) {
                SLA.update(vm.sLA, onSaveSuccess, onSaveError);
            } else {
                SLA.save(vm.sLA, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
