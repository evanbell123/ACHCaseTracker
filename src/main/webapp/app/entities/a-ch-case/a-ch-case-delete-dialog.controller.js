(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDeleteController',ACHCaseDeleteController);

    ACHCaseDeleteController.$inject = ['$uibModalInstance', 'entity', 'ACHCase'];

    function ACHCaseDeleteController($uibModalInstance, entity, ACHCase) {
        var vm = this;
        vm.aCHCase = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            ACHCase.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
