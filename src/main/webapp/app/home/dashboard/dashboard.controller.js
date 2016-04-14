(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope'];

    function DashboardController($scope) {
        var vm = this;
        $scope.message = 'Look! I am a Dashboard.';
    }
})();
