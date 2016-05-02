(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseController', ACHCaseController);

    ACHCaseController.$inject = ['$scope', '$state', '$filter', 'ACHCase', 'ParseLinks', 'AlertService', 'Principal'];

    function ACHCaseController($scope, $state, $filter, ACHCase, ParseLinks, AlertService, Principal) {
        var vm = this;
        $scope.filterParams = {};
        vm.ACHCases = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.previousMonth = previousMonth;
        vm.toDate = null;
        vm.today = today;

        vm.today();
        vm.previousMonth();

        vm.slaPast = function(deadline){
           return Date.parse(deadline) < new Date();
        }

        vm.loadAll = function() {
            var dateFormat = 'yyyy-MM-dd';
            var fromDate = $filter('date')(vm.fromDate, dateFormat);
            var toDate = $filter('date')(vm.toDate, dateFormat);
            ACHCase.all({
                page: vm.page,
                size: 20,
                status: 0,
                fromDate: fromDate,
                toDate: toDate,
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

        // Date picker configuration
        function today () {
            // Today + 1 day - needed if the current day must be included
            var today = new Date();
            vm.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        }

        function previousMonth () {
            var fromDate = new Date();
            if (fromDate.getMonth() === 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 11, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
            }

            vm.fromDate = fromDate;
        }

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

        // Allow filtering of nested objects - will need to update once more case types are added (better yet, probably a rewrite)
        $scope.$on('advanced-searchbox:modelUpdated', function (event, model) {
            if (model === undefined) { return; }
            if (model['query'] !== undefined) { return $scope.filterParams = model['query']; }

            var achCase = new ACHCase();
            angular.forEach(model, function(value, key) {
                var sub1 = key.split(".")[0];
                if (sub1 === 'beneficiary') {
                    if (achCase.beneficiary === undefined) { achCase.beneficiary = {}; }
                    achCase.beneficiary[key.split(".")[1]] = value;
                }
                else if (sub1 === 'caseDetail') {
                    var sub2 = key.split(".")[1];
                    if (achCase.caseDetail === undefined) { achCase.caseDetail = {}; }
                    if (sub2 === 'recoveryInfo') {
                        if (achCase.caseDetail.recoveryInfo === undefined) { achCase.caseDetail.recoveryInfo = {}; }
                        achCase.caseDetail.recoveryInfo[key.split(".")[2]] = value;
                    }
                    else if (sub2 === 'payments') {
                        if (achCase.caseDetail.payments === undefined) { achCase.caseDetail.payments = []; }
                        var payment = {};
                        payment[key.split(".")[2]] = parseFloat(value);
                        achCase.caseDetail.payments.push(payment);
                    }
                    else if (sub2 === 'notes') {
                        if (achCase.caseDetail.notes === undefined) { achCase.caseDetail.notes = {}; }
                        var note = {};
                        note[key.split(".")[2]] = value;
                        achCase.caseDetail.notes.push(note);
                    }
                    else
                        achCase.caseDetail[key.split(".")[1]] = value;
                }
                else if (sub1 === 'sla') {
                    if (achCase.sla === undefined) { achCase.sla = {}; }
                    achCase.sla[key.split(".")[1]] = value;
                }
                else if (key !== 'query')
                    achCase[key] = value;
            });
            $scope.filterParams = achCase;
         });

        $scope.availableSearchParams = [
            { key: "status", name: "Status", placeholder: "Status...", restrictToSuggestedValues: true, suggestedValues: ['Open', 'In Progress', 'Closed']},
            { key: "daysOpen", name: "Days Open", placeholder: "Days Open..." },
            { key: "type", name: "Type", placeholder: "Case Type...", restrictToSuggestedValues: true, suggestedValues: ['Open', 'In Progress', 'Closed']},
            { key: "totalAmount", name: "Total Amount", placeholder: "Total Amount..." },
            { key: "slaDeadline", name: "SLA Deadline", placeholder: "mm-dd-yyyy" },
            { key: "assignedTo", name: "Assigned To", placeholder: "Assigned To..." },
            { key: "completedOn", name: "Date Closed", placeholder: "mm-dd-yyyy" },
            { key: "completedBy", name: "Closed By", placeholder: "Closed By..." },
            { key: "beneficiary.name", name: "Beneficiary Name", placeholder: "Name" },
            { key: "beneficiary.ssn", name: "Beneficiary SSN", placeholder: "###-##-####" },
            { key: "beneficiary.customerID", name: "Customer ID", placeholder: "Cust. ID" },
            { key: "beneficiary.dateOfDeath", name: "Date of Death", placeholder: "mm-dd-yyyy" },
            { key: "beneficiary.dateCBAware", name: "Date CB Aware", placeholder: "mm-dd-yyyy" },
            { key: "beneficiary.otherGovBenefits", name: "Other Benefits", placeholder: "Other Benefits?" },
            { key: "beneficiary.govBenefitsComment", name: "Benefits Comment", placeholder: "Comment" },
            { key: "caseDetail.claimNumber", name: "Claim Number", placeholder: "Claim #" },
            { key: "caseDetail.fullRecovery", name: "Full Recovery", placeholder: "Full Recovery?" },
            { key: "caseDetail.paymentTotal", name: "Payments Total", placeholder: "Sum of Payments" },
            { key: "caseDetail.paymentCount", name: "# of Payments", placeholder: "# Payments" },
            { key: "caseDetail.subtype", name: "Case Subtype", placeholder: "Subtype" },
            { key: "caseDetail.verifiedBy", name: "Verified By", placeholder: "Verified By" },
            { key: "caseDetail.verifiedOn", name: "Date Verified", placeholder: "mm-dd-yyyy" },
            { key: "caseDetail.recoveryInfo.method", name: "Recovery Method", placeholder: "Recovery Method" },
            { key: "caseDetail.recoveryInfo.detailValue", name: "Recovery Detail", placeholder: "Recovery Detail" },
            { key: "caseDetail.recoveryInfo.detailString", name: "Recovery Comment", placeholder: "Recovery Comment" },
            { key: "caseDetail.payments.effectiveOn", name: "Effective Date", placeholder: "mm-dd-yyyy" },
            { key: "caseDetail.payments.amount", name: "Payment Amount", placeholder: "$$$" },
            { key: "caseDetail.notes.note", name: "Case Note", placeholder: "Note" },
            { key: "sla.id", name: "SLA Type", placeholder: "SLA Type" },
            { key: "sla.businessDays", name: "SLA Duration", placeholder: "# Days" },
        ];
    }
})();


