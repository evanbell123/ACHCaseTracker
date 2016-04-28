(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope'];

    function DashboardController($scope) {
        var vm = this;
        $scope.SLApassed = SLApassed($scope);

        function SLApassed()
        {
            return 3;
        }
    }


})();
