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
                }
            })
            .state('dashboard', {
                parent: 'home',
                url: 'dashboard',
                templateUrl: 'app/home/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm',
                data: {
                    authorities: ['ROLE_ADMIN'],
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
                    }
                },
                resolve: {}
            })
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
                    entity: ['$stateParams', 'ACHCase', function($stateParams, ACHCase) {
                        return ACHCase.get({
                            id: $stateParams.id
                        });
                    }]
                }
            })
            .state('ach-case.new', {
                parent: 'ach-case',
                url: 'new',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'CaseFormController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function() {
                                return {
                                    "totalAmount": null,
                                    "id": null,
                                    "status": "OPEN",
                                    "lastPaymentOn": null,
                                    "slaDeadline": null,
                                    "sla": null,
                                    "daysOpen": 0,
                                    "type": null,
                                    "beneficiary": {
                                        "customerID": null,
                                        "name": null,
                                        "ssn": null,
                                        "accountNum": null,
                                        "dateOfDeath": null,
                                        "dateCBAware": null,
                                        "otherGovBenefits": false,
                                        "govBenefitsComment": null
                                    },
                                    "assignedTo": null,
                                    //"isWatched": false,
                                    "caseDetail": {
                                        "@class": "com.commercebank.www.domain.GovRec",
                                        "claimNumber": null,
                                        "completedOn": null,
                                        "verifiedOn": null,
                                        "fullRecovery": false,
                                        "paymentTotal": 0.0,
                                        "paymentCount": 0,
                                        "verifiedBy": null,
                                        "recoveryInfo": {
                                            "method": null,
                                            "detailType": null,
                                            "detailValue": null,
                                            "detailString": null,
                                        },
                                        "notes": null,
                                        "payments": null
                                    }
                                };
                            }
                        }
                    }).result.then(function() {
                        $state.go('ach-case', null, {
                            reload: true
                        });
                    }, function() {
                        $state.go('ach-case');
                    });
                }]
            })
            .state('ach-case.edit', {
                parent: 'ach-case',
                url: '{id}/edit',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'ACHCaseDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['ACHCase', function(ACHCase) {
                                return ACHCase.one({
                                    id: $stateParams.id
                                });
                            }]
                        }
                    }).result.then(function() {
                        $state.go('ach-case', null, {
                            reload: true
                        });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('ach-case.delete', {
                parent: 'ach-case',
                url: '{id}/delete',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-delete-dialog.html',
                        controller: 'ACHCaseDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['ACHCase', function(ACHCase) {
                                return ACHCase.one({
                                    id: $stateParams.id
                                });
                            }]
                        }
                    }).result.then(function() {
                        $state.go('ach-case', null, {
                            reload: true
                        });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            //.state('my-cases', {
            //    parent: 'home',
            //    url: 'my-cases',
            //    templateUrl: 'app/home/cases/cases.html',
            //    controller: 'CasesController',
            //    controllerAs: 'vm',
            //    data: {
            //        authorities: []
            //    }
            //})
            /*.state('create-case', {
                parent: 'home',
                url: 'create-case',
                templateUrl: 'app/home/form/caseForm.html',
                controller: 'CaseFormController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                }
            })
            .state('edit-case', {
                parent: 'home',
                url: 'edit-case/:caseId',
                templateUrl: 'app/home/form/caseForm.html',
                controller: 'CaseFormController',
                controllerAs: 'vm',
                data: {
                    authorities: []
                },
            })*/
            .state('import', {
                parent: 'home',
                url: "import",
                templateUrl: "app/home/import/import.html",
                controller: 'ImportController',
                controllerAs: 'vm',
                data: {
                    pageTitle: 'File import',
                    authorities: [] },
                resolve: {
                    loadPlugin: function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['app/content/css/basic.css','app/content/css/dropzone.css','app/home/import/dropzone.js']
                            }
                        ]);
                    }
                }
            });
    }
})();
