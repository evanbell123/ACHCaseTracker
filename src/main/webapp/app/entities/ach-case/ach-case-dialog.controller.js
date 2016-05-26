(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDialogController', ACHCaseDialogController);

    ACHCaseDialogController.$inject = ['$scope', '$uibModalInstance', 'entity', 'ACHCase', 'Principal', 'User', 'Enums'];

    function ACHCaseDialogController ($scope, $uibModalInstance, entity, ACHCase, Principal, User, Enums) {
        var vm = this;
        vm.ACHCase = entity;
        vm.payments= ACHCase.payments;
        vm.users = [];
        vm.subtypes = {};
        vm.dateformat = 'mediumDate';
        vm.datetimeformat = 'medium';
        vm.enums = function() { vm.subtypes = Enums.CaseSubtype; };
        vm.isAdmin = Principal.hasAuthority("ROLE_ADMIN").then(function(result) { $scope.isAdmin = result; });
        vm.getUsers = User.query(null, function (result) { vm.users = result; });
        vm.setRecoveryDetail = function() {
            if (vm.ACHCase.caseDetail.recoveryInfo.method == "Cashiers Check Mailed") {
                vm.ACHCase.caseDetail.recoveryInfo.detailType = "Check Number";
                $scope.stringType = "Mailed To";
            }
            else if (vm.ACHCase.caseDetail.recoveryInfo.method == "Commerce Bank") {
                vm.ACHCase.caseDetail.recoveryInfo.detailType = "GL and Cost Center";
            }
            else if (vm.ACHCase.caseDetail.recoveryInfo.method == "Customer DDA") {
                vm.ACHCase.caseDetail.recoveryInfo.detailType = "Account Number"
            }
            else if (vm.ACHCase.caseDetail.recoveryInfo.method == "Other") {
                vm.ACHCase.caseDetail.recoveryInfo.detailType = null;
                $scope.stringType = "Description";
            }
            else {
                vm.ACHCase.caseDetail.recoveryInfo.detailType = null;
                $scope.stringType = null;
            }
        };
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
