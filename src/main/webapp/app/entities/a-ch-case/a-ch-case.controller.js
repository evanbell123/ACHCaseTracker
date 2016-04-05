(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseController', ACHCaseController);

    ACHCaseController.$inject = ['$scope', '$state', 'ACHCase', 'ParseLinks', 'AlertService'];

    function ACHCaseController ($scope, $state, ACHCase, ParseLinks, AlertService) {
        var vm = this;
        vm.aCHCases = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.loadAll = function() {
            ACHCase.query({
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
                    vm.aCHCases.push(data[i]);
                }
                console.log(vm.aCHCases);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };
        vm.reset = function() {
            vm.page = 0;
            vm.aCHCases = [];
            vm.loadAll();
        };
        vm.loadPage = function(page) {
            vm.page = page;
            vm.loadAll();
        };

        vm.loadAll();

    }
})();
