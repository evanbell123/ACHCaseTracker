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
                templateUrl: 'app/home/auditlog/auditlog.html',
                controller: 'AuditLogController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('dashboard', {
                parent: 'home',
                url: 'dashboard',
                templateUrl: 'app/home/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('cases', {
                parent: 'home',
                url: 'cases',
                templateUrl: 'app/home/cases/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('my_cases', {
                parent: 'home',
                url: 'my_cases',
                templateUrl: 'app/home/cases/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('sla_passed_cases', {
                parent: 'home',
                url: 'sla_passed_cases',
                templateUrl: 'app/home/cases/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('import', {
                parent: 'home',
                url: 'import',
                templateUrl: 'app/home/import/import.html',
                controller: 'ImportController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('create_case', {
                parent: 'home',
                url: 'create_case',
                templateUrl: 'app/home/form/caseForm.html',
                controller: 'CaseFormController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            });
    }
})();
