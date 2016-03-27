(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('BeneficiaryDetailController', BeneficiaryDetailController);

    BeneficiaryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Beneficiary'];

    function BeneficiaryDetailController($scope, $rootScope, $stateParams, entity, Beneficiary) {
        var vm = this;
        vm.beneficiary = entity;
        vm.load = function (id) {
            Beneficiary.get({id: id}, function(result) {
                vm.beneficiary = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:beneficiaryUpdate', function(event, result) {
            vm.beneficiary = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
