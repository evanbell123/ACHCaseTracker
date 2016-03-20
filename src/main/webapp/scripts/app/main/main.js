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
                },
                resolve: {

                },
            })
            .state('audit_log', {
              parent: 'home',
                url: 'audit_log',
                templateUrl: 'scripts/app/partials/auditlog.html',
                controller: 'AuditLogController',
                data: {
                    authorities: []
                },
            })
            .state('cases', {
              parent: 'home',
                url: 'cases',
                templateUrl: 'scripts/app/partials/cases.html',
                controller: 'CasesController',
                data: {
                    authorities: []
                },
            })
            .state('my_cases', {
              parent: 'home',
                url: 'my_cases',
                templateUrl: 'scripts/app/partials/cases.html',
                controller: 'CasesController',
                data: {
                    authorities: []
                },
            })
            .state('import', {
              parent: 'home',
                url: 'import',
                templateUrl: 'scripts/app/partials/import.html',
                controller: 'ImportController',
                data: {
                    authorities: []
                },
            })
            .state('create_case', {
              parent: 'home',
                url: 'create_case',
                templateUrl: 'scripts/app/partials/caseForm.html',
                controller: 'CaseFormController as vm',
                data: {
                    authorities: []
                },
            })
    });
