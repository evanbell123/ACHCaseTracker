(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseController', ACHCaseController);

    ACHCaseController.$inject = ['$scope', '$state', '$filter', 'ACHCase', 'ParseLinks', 'AlertService'];

    function ACHCaseController($scope, $state, $filter, ACHCase, ParseLinks, AlertService) {
        var vm = this;
        vm.ACHCases = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.toDate = null;
        vm.currentUser = null;
        vm.today = today;
        vm.previousMonth = previousMonth;

        vm.today();
        vm.previousMonth();

        vm.slaPast = function(deadline){ return Date.parse(deadline) < new Date(); };

        vm.loadAll = function() {
            var dateFormat = 'yyyy-MM-dd';
            var fromDate = $filter('date')(vm.fromDate, dateFormat);
            var toDate = $filter('date')(vm.toDate, dateFormat);
            if ($state.is("ach-case-assigned")) {
                ACHCase.assigned({
                    page: vm.page,
                    size: 20,
                    status: 0,           //Here for when status picker added
                    fromDate: fromDate,  //Here for when date range picker added
                    toDate: toDate,
                    sort: sort()
                }, onSuccess, onError);
            } else {
                ACHCase.all({
                    page: vm.page,
                    size: 20,
                    status: 0,           //Here for when status picker added
                    fromDate: fromDate,  //Here for when date range picker added
                    toDate: toDate,
                    sort: sort()
                }, onSuccess, onError);
            }

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
                    if (data[i].assignedTo !== undefined && data[i].assignedTo !== null) {
                        data[i].isWatched = true;
                    }
                    else { data[i].isWatched = false; }
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
        /* TODO: Add date range picker and update data according to chosen dates
        function onChangeDate () {
            var dateFormat = 'yyyy-MM-dd';
            var fromDate = $filter('date')(vm.fromDate, dateFormat);
            var toDate = $filter('date')(vm.toDate, dateFormat);
            //TODO: This is copied from audits.controller.js, it needs to be changed before use
            AuditsService.query({page: vm.page -1, size: 20, fromDate: fromDate, toDate: toDate}, function(result, headers){
                vm.audits = result;
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
            });
        }*/

        $scope.watch = function(achCase) {
            if (achCase.isWatched == false) { achCase.assignedTo = null; }
            ACHCase.update({watchItem: achCase.isWatched}, achCase, function(result){
                achCase.assignedTo = result.assignedTo;
                achCase.status = result.status;
                achCase.slaDeadline = result.slaDeadline;
            })
        };

        $scope.filterParams = {};
        //Allow filtering of nested objects - will probably need to be rewritten once more case types are added
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
            //TODO: Search for enum values based on their display name, rather than by their literal name. ex: 'In Progress' would find cases with status 'IN_PROGRESS'
            { key: "status", name: "Status", placeholder: "Status...", restrictToSuggestedValues: true, suggestedValues: ['OPEN', 'IN_PROGRESS', 'CLOSED']},
            { key: "daysOpen", name: "Days Open", placeholder: "Days Open..." },
            { key: "type", name: "Type", placeholder: "Case Type...", restrictToSuggestedValues: true, suggestedValues: ['GOV_REC', 'POA', 'REV_DEL', 'RETURN', 'UNRESOLVED']},
            { key: "totalAmount", name: "Total Amount", placeholder: "Total Amount..." },
            { key: "slaDeadline", name: "SLA Deadline", placeholder: "yyyy-mm-dd" },
            { key: "assignedTo", name: "Assigned To", placeholder: "Assigned To..." },
            { key: "completedOn", name: "Date Closed", placeholder: "yyyy-mm-dd" },
            { key: "completedBy", name: "Closed By", placeholder: "Closed By..." },
            { key: "beneficiary.name", name: "Beneficiary Name", placeholder: "Name" },
            { key: "beneficiary.ssn", name: "Beneficiary SSN", placeholder: "###-##-####" },
            { key: "beneficiary.customerID", name: "Customer ID", placeholder: "Cust. ID" },
            { key: "beneficiary.dateOfDeath", name: "Date of Death", placeholder: "yyyy-mm-dd" },
            { key: "beneficiary.dateCBAware", name: "Date CB Aware", placeholder: "yyyy-mm-dd" },
            { key: "beneficiary.otherGovBenefits", name: "Other Benefits", placeholder: "Other Benefits?" },
            { key: "beneficiary.govBenefitsComment", name: "Benefits Comment", placeholder: "Comment" },
            { key: "caseDetail.claimNumber", name: "Claim Number", placeholder: "Claim #" },
            { key: "caseDetail.fullRecovery", name: "Full Recovery", placeholder: "Full Recovery?" },
            { key: "caseDetail.paymentTotal", name: "Payments Total", placeholder: "Sum of Payments" },
            { key: "caseDetail.paymentCount", name: "# of Payments", placeholder: "# Payments" },
            { key: "caseDetail.subtype", name: "Case Subtype", placeholder: "Subtype", restrictToSuggestedValues: true, suggestedValues: ['DNE', 'CRF', 'DCN', 'GOV_REC', 'TREAS_REFERRAL', 'TREAS_REFUND']},
            { key: "caseDetail.verifiedBy", name: "Verified By", placeholder: "Verified By" },
            { key: "caseDetail.verifiedOn", name: "Date Verified", placeholder: "yyyy-mm-dd" },
            { key: "caseDetail.recoveryInfo.method", name: "Recovery Method", placeholder: "Recovery Method", restrictToSuggestedValues: true, suggestedValues: ['ACH_RETURN', 'CHECK_MAILED', 'MIXED_METHOD', 'COMMERCE', 'CUST_DDA', 'NO_FUNDS', 'OTHER']},
            { key: "caseDetail.recoveryInfo.detailValue", name: "Recovery Detail", placeholder: "Recovery Detail", restrictToSuggestedValues: true, suggestedValues: ['CHK_NUM', 'GL_COST', 'IN_ACCT', 'DESC']},
            { key: "caseDetail.recoveryInfo.detailString", name: "Recovery Comment", placeholder: "Recovery Comment" },
            //TODO: Can we filter on values in an array of objects, within an object, within another object?
            //{ key: "caseDetail.payments.effectiveOn", name: "Effective Date", placeholder: "yyyy-mm-dd" },
            //{ key: "caseDetail.payments.amount", name: "Payment Amount", placeholder: "$$$" },
            //{ key: "caseDetail.notes.note", name: "Case Note", placeholder: "Note" },
            { key: "sla.id", name: "SLA Type", placeholder: "SLA Type" },
            { key: "sla.businessDays", name: "SLA Duration", placeholder: "# Days" },
        ];
    }
})();


