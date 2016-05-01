(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$filter', 'Dashboard', 'ParseLinks'];

    function DashboardController($filter, Dashboard, ParseLinks) {
        var vm = this;

        vm.totals = null;
        vm.fromDate = null;
        vm.toDate = null;
        vm.page = 0;
        vm.onChangeDate = onChangeDate;
        vm.loadPage = loadPage;
        vm.previousMonth = previousMonth;
        vm.today = today;

        vm.today();
        vm.previousMonth();
        vm.onChangeDate();

        function onChangeDate() {
            var dateFormat = 'yyyy-MM-dd';
            var fromDate = $filter('date')(vm.fromDate, dateFormat);
            var toDate = $filter('date')(vm.toDate, dateFormat);

            Dashboard.query({fromDate: fromDate, toDate: toDate}, function(result){
                vm.totals = result;
            });
        }

        // Date picker configuration
        function today() {
            // Today + 1 day - needed if the current day must be included
            var today = new Date();
            vm.toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        }

        function previousMonth() {
            var fromDate = new Date();
            if (fromDate.getMonth() === 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 11, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
                console.log("Previous Month");
            }
            vm.fromDate = fromDate;
        }

        function loadPage (page) {
            vm.page = page;
            vm.onChangeDate();
        }
    }

})();
