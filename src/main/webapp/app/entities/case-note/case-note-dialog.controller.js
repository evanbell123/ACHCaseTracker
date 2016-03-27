(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseNoteDialogController', CaseNoteDialogController);

    CaseNoteDialogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'CaseNote'];

    function CaseNoteDialogController ($scope, $stateParams, $uibModalInstance, entity, CaseNote) {
        var vm = this;
        vm.caseNote = entity;
        vm.load = function(id) {
            CaseNote.get({id : id}, function(result) {
                vm.caseNote = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:caseNoteUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            if (vm.caseNote.id !== null) {
                CaseNote.update(vm.caseNote, onSaveSuccess, onSaveError);
            } else {
                CaseNote.save(vm.caseNote, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
