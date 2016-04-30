(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseController', ACHCaseController);

    ACHCaseController.$inject = ['$scope', '$state', 'ACHCase', 'ParseLinks', 'AlertService'];

    function ACHCaseController ($scope, $state, ACHCase, ParseLinks, AlertService) {
        var vm = this;
        vm.ACHCases = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.slaPast = function(deadline){
           return Date.parse(deadline) < new Date();
        }
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
                    vm.ACHCases.push(data[i]);
                }
                console.log(vm.ACHCases);
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };
        vm.reset = function() {
            vm.page = 0;
            vm.ACHCases = [];
            vm.loadAll();
        };
        vm.loadPage = function(page) {
            vm.page = page;
            vm.loadAll();
        };

        vm.loadAll();

        $scope.$on('advanced-searchbox:addedSearchParam', function (event, searchParameter) {
        });

        $scope.$on('advanced-searchbox:modelUpdated', function (event, model) {

        });

        $scope.availableSearchParams = [
            { key: "status", name: "Status", placeholder: "Status...", restrictToSuggestedValues: true, suggestedValues: ['Open', 'In_Progress', 'Closed']},
            { key: "daysOpen", name: "Days Open", placeholder: "Days Open..." },
            { key: "type", name: "Type", placeholder: "Case Type..." },
            { key: "totalAmount", name: "Total Amount", placeholder: "Total Amount..." },
            { key: "slaDeadline", name: "SLA Deadline", placeholder: "SLA Deadline..." },
            { key: "assignedTo", name: "Assigned To", placeholder: "Assigned To..." }
        ];
    }
})();
