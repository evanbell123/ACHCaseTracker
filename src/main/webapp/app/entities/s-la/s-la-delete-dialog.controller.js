(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('SLADeleteController',SLADeleteController);

    SLADeleteController.$inject = ['$uibModalInstance', 'entity', 'SLA'];

    function SLADeleteController($uibModalInstance, entity, SLA) {
        var vm = this;
        vm.sLA = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            SLA.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
