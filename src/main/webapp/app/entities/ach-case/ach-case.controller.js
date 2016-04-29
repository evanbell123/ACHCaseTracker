(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseController', ACHCaseController);

    ACHCaseController.$inject = ['$scope', '$state', 'ACHCase', 'ParseLinks', 'AlertService', 'Principal'];

    function ACHCaseController($scope, $state, ACHCase, ParseLinks, AlertService, Principal) {
        var vm = this;
        vm.ACHCases = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.slaPast = function(deadline) {
            return Date.parse(deadline) < new Date();
        }
        vm.loadAll = function() {
            ACHCase.all({
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

        $scope.availableSearchParams = [{
            key: "status",
            name: "Status",
            placeholder: "Status...",
            restrictToSuggestedValues: true,
            suggestedValues: ['Open', 'In Progress', 'Closed']
        }, {
            key: "daysOpen",
            name: "Days Open",
            placeholder: "Days Open..."
        }, {
            key: "type",
            name: "Type",
            placeholder: "Case Type..."
        }, {
            key: "totalAmount",
            name: "Total Amount",
            placeholder: "Total Amount..."
        }, {
            key: "slaDeadline",
            name: "SLA Deadline",
            placeholder: "SLA Deadline..."
        }, {
            key: "assignedTo",
            name: "Assigned To",
            placeholder: "Assigned To..."
        }, {
            key: "beneficiary: {name",
            name: "Beneficiary Name",
            placeholder: "Name"
        }];

        $scope.watch = function(caseData) {
          console.log(caseData.isWatched);

          /*
            If the user checks 'watch item'
            assign that user to the case
            */
            if (caseData.isWatched == true) {
                var copyAccount;
                Principal.identity().then(function(account) {
                    copyAccount = account;
                    caseData.assignedTo = copyAccount.login;
                });
            } else { //If the user unchecks 'watch item', unassign the currently assigned user
                caseData.assignedTo = null;
            }
            /*
            notify the server of this change of assignment
            */
            ACHCase.update(caseData);
        }
    }
})();
