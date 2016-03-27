(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('BeneficiaryController', BeneficiaryController);

    BeneficiaryController.$inject = ['$scope', '$state', 'Beneficiary', 'ParseLinks', 'AlertService'];

    function BeneficiaryController ($scope, $state, Beneficiary, ParseLinks, AlertService) {
        var vm = this;
        vm.beneficiaries = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.loadAll = function() {
            Beneficiary.query({
                page: vm.page,
                size: 20,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.beneficiaries.push(data[i]);
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };
        vm.reset = function() {
            vm.page = 0;
            vm.beneficiaries = [];
            vm.loadAll();
        };
        vm.loadPage = function(page) {
            vm.page = page;
            vm.loadAll();
        };

        vm.loadAll();

    }
})();
