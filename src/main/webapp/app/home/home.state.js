(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('home', {
                parent: 'app',
                url: '/',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/home/home.html',
                        controller: 'HomeController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('audit_log', {
                parent: 'home',
                url: 'audit_log',
                templateUrl: 'app/partials/auditlog.html',
                controller: 'AuditLogController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('cases', {
                parent: 'home',
                url: 'cases',
                templateUrl: 'app/partials/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('my_cases', {
                parent: 'home',
                url: 'my_cases',
                templateUrl: 'app/partials/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('import', {
                parent: 'home',
                url: 'import',
                templateUrl: 'app/partials/import.html',
                controller: 'ImportController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('create_case', {
                parent: 'home',
                url: 'create_case',
                templateUrl: 'app/partials/caseForm.html',
                controller: 'CaseFormController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            });
    }
})();
