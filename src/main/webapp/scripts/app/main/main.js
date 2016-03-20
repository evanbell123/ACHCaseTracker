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

                children: [{
                    views: {
                        'audit_log@': {
                            //name: 'audit_log',
                            templateUrl: 'scripts/app/main/audit_log/audit_log.html',
                            controller: 'AuditLogController'
                        }
                    },

                    views: {
                        'cases@': {
                            name: 'cases',
                            templateUrl: 'scripts/app/audit_log/cases.html',
                            controller: 'AuditLogController'
                        }
                    },

                    views: {
                        'my_cases@': {
                            name: 'my_cases',
                            templateUrl: 'scripts/app/audit_log/my_cases.html',
                            controller: 'AuditLogController'
                        }
                    },

                    views: {
                        'import@': {
                            name: 'import',
                            templateUrl: 'scripts/app/audit_log/import.html',
                            controller: 'AuditLogController'
                        }
                    },

                    views: {
                        'create_case@': {
                            name: 'create_case',
                            templateUrl: 'scripts/app/audit_log/create_case.html',
                            controller: 'AuditLogController'
                        }
                    },

                }]
            })
    });
