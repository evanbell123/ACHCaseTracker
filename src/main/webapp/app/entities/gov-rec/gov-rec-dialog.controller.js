(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('GovRecDialogController', GovRecDialogController);

    GovRecDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'GovRec'];

    function GovRecDialogController ($scope, $stateParams, $uibModalInstance, entity, GovRec) {
        var vm = this;
        vm.govRec = entity;
        vm.load = function(id) {
            GovRec.get({id : id}, function(result) {
                vm.govRec = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:govRecUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.govRec.id !== null) {
                GovRec.update(vm.govRec, onSaveSuccess, onSaveError);
            } else {
                GovRec.save(vm.govRec, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.datePickerOpenStatus = {};
        vm.datePickerOpenStatus.completedOn = false;
        vm.datePickerOpenStatus.verifiedOn = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };
    }
})();
