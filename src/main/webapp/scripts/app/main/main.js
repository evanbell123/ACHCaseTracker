'use strict';

angular.module('achcasetrackerApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'site',
                url: '/',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/main/main.html',
                        controller: 'MainController'
                    },
                    /*
                    'audit_log@': {
                        templateUrl: 'scripts/app/audit_log/audit_log.html',
                        controller: 'AuditLogController'
                    }
                    */
                },
                resolve: {

                },
            })
            .state('audit_log', {
              parent: 'home',
                url: 'auditlog',
                templateUrl: 'scripts/app/audit_log/audit_log.html',
                controller: 'AuditLogController',
                data: {
                    authorities: []
                },
            })
    });
