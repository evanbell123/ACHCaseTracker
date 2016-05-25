(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDialogController', ACHCaseDialogController);

    ACHCaseDialogController.$inject = ['$scope', '$uibModalInstance', 'entity', 'ACHCase', 'DateUtils', 'Principal'];

    function ACHCaseDialogController ($scope, $uibModalInstance, entity, ACHCase, DateUtils, Principal) {
        var vm = this;
        vm.ACHCase = entity;
        vm.payments= ACHCase.payments;
        vm.dateformat = DateUtils.dateformat();
        vm.datetimeformat = 'MM/dd/yyyy h:mm';
        $scope.isAdmin = Principal.hasAuthority("ROLE_ADMIN").then(function(result) { return result; });
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
        vm.datePickerOpenStatus.dateOfDeath = false;
        vm.datePickerOpenStatus.dateCBAware = false;
        vm.datePickerOpenStatus.completedOn = false;
        vm.datePickerOpenStatus.verifiedOn = false;
        vm.datePickerOpenStatus.effectiveOn = false;

        vm.openCalendar = function(date) {
            vm.datePickerOpenStatus[date] = true;
        };

        $scope.addNewPayment = function() {
            //if (ACHCase.caseDetail === undefined) { ACHCase.caseDetail  }
            var newItemNo = vm.ACHCase.caseDetail.payments.length + 1;
            vm.ACHCase.caseDetail.payments.push({'id': 'pmt' + newItemNo});
        };

        $scope.deletePayment = function() {
            vm.ACHCase.caseDetail.payments.pop();
        };

        $scope.addNewNote = function() {
            var newItemNo = vm.ACHCase.caseDetail.notes.length + 1;
            vm.ACHCase.caseDetail.notes.push({'id': 'note' + newItemNo});
        };

        $scope.deleteNote = function() {
            vm.ACHCase.caseDetail.notes.pop();
        };
    }
})();
