'use strict';

angular.module('achcasetrackerApp')
    .controller('AuditLogController', function ($scope, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.message = 'Look! I am an audit log.';
    });
