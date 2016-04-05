(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('AuditLogController', AuditLogController);

    AuditLogController.$inject = ['$scope'];

    function AuditLogController($scope) {
        var vm = this;
        $scope.message = 'Look! I am an audit log.';
    }
})();
