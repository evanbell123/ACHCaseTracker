(function () {
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
                }
            })
            .state('dashboard', {
                parent: 'home',
                url: 'dashboard',
                templateUrl: 'app/home/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'Dashboard'
                }
            })
            .state('ach-case', {
                parent: 'home',
                url: 'ach-case',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'ACH Cases'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/ach-case/ach-case.html',
                        controller: 'ACHCaseController',
                        controllerAs: 'vm'
                    },
                },
                resolve: {}
            })
            .state('ach-case-assigned', {
                parent: 'home',
                url: 'my-cases/',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'ACH Cases'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/ach-case/ach-case.html',
                        controller: 'ACHCaseController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {}
            })
            /*
             Not working yet
             */
            .state('ach-case-detail', {
                parent: 'home',
                url: 'ach-case/{id}',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'ACHCase'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/ach-case/ach-case-detail.html',
                        controller: 'ACHCaseDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'ACHCase', function ($stateParams, ACHCase) {
                        return ACHCase.one({id: $stateParams.id});
                    }]
                }
            })
            .state('ach-case.new', {
                parent: 'ach-case',
                url: 'new',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'ACHCaseDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    "createdDate": null,
                                    "id": null,
                                    "status": null,
                                    "totalAmount": null,
                                    "slaDeadline": null,
                                    "missedSLACount": 0,
                                    "sla": {
                                        "id": null,
                                        "businessDays": null
                                    },
                                    "daysOpen": 0,
                                    "completedOn": null,
                                    "completedBy": null,
                                    "assignedTo": null,
                                    "type": null,
                                    "beneficiary": {
                                        "id": null,
                                        "customerID": null,
                                        "name": null,
                                        "ssn": null,
                                        "accountNum": null,
                                        "dateOfDeath": null,
                                        "dateCBAware": null,
                                        "otherGovBenefits": null,
                                        "govBenefitsComment": null
                                    },
                                    "caseDetail": {
                                        "@class": null,
                                        "id": null,
                                        "claimNumber": null,
                                        "verifiedOn": null,
                                        "fullRecovery": null,
                                        "paymentTotal": 0,
                                        "paymentCount": 0,
                                        "subtype": null,
                                        "verifiedBy": null,
                                        "recoveryInfo": null,
                                        "notes": null,
                                        "payments": null
                                    }
                                }
                            }
                        }
                    }).result.then(function () {
                        $state.go('ach-case', null, {reload: true});
                }, function () {
                    $state.go('ach-case');
                });
                }]
            })
            .state('ach-case.edit', {
                parent: 'ach-case',
                url: '{id}/edit',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'ACHCaseDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['ACHCase', function (ACHCase) {
                                return ACHCase.one({id: $stateParams.id});
                            }]
                        }
                    }).result.then(function () {
                        $state.go('ach-case', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('ach-case.delete', {
                parent: 'ach-case',
                url: '{id}/delete',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-delete-dialog.html',
                        controller: 'ACHCaseDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['ACHCase', function (ACHCase) {
                                return ACHCase.one({id: $stateParams.id});
                            }]
                        }
                    }).result.then(function () {
                        $state.go('ach-case', null, {
                            reload: true
                        });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

            .state('import', {
                parent: 'home',
                url: "import",
                templateUrl: "app/home/import/import.html",
                controller: 'ImportController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'File import',
                    authorities: []
                },
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['app/content/css/basic.css', 'app/content/css/dropzone.css', 'app/home/import/dropzone.js']
                            }
                        ]);
                    }
                }
            });
}
})
();
