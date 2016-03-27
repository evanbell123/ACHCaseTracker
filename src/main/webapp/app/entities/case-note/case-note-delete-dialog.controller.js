(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseNoteDeleteController',CaseNoteDeleteController);

    CaseNoteDeleteController.$inject = ['$uibModalInstance', 'entity', 'CaseNote'];

    function CaseNoteDeleteController($uibModalInstance, entity, CaseNote) {
        var vm = this;
        vm.caseNote = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            CaseNote.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
