(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('RecoveryDeleteController',RecoveryDeleteController);

    RecoveryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Recovery'];

    function RecoveryDeleteController($uibModalInstance, entity, Recovery) {
        var vm = this;
        vm.recovery = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Recovery.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
