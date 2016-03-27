(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('GovRecDeleteController',GovRecDeleteController);

    GovRecDeleteController.$inject = ['$uibModalInstance', 'entity', 'GovRec'];

    function GovRecDeleteController($uibModalInstance, entity, GovRec) {
        var vm = this;
        vm.govRec = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            GovRec.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
