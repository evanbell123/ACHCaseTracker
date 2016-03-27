(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('BeneficiaryDeleteController',BeneficiaryDeleteController);

    BeneficiaryDeleteController.$inject = ['$uibModalInstance', 'entity', 'Beneficiary'];

    function BeneficiaryDeleteController($uibModalInstance, entity, Beneficiary) {
        var vm = this;
        vm.beneficiary = entity;
        vm.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        vm.confirmDelete = function (id) {
            Beneficiary.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };
    }
})();
