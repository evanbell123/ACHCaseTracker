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
            .state('audit-log', {
                parent: 'home',
                url: 'audit-log',
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
                url: 'ach-case',
                templateUrl: 'app/home/cases/cases.html',
                controller: 'CasesController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })
            .state('my-cases', {
                parent: 'home',
                url: 'my-cases',
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
            .state('create-case', {
                parent: 'home',
                url: 'create-case',
                templateUrl: 'app/home/form/caseForm.html',
                controller: 'CaseFormController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            });
    }
})();
