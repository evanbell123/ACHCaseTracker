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
                url: '',
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
                url: '/ach-case/',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'ACHCases'
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
            .state('ach-case-assigned', {
                parent: 'home',
                url: 'my-cases/',
                data: {
                    authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                    pageTitle: 'ACHCases'
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
                url: '/ach-case/{id}',
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
                        return ACHCase.one({
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
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'CaseFormController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    "id": null,
                                    "totalAmount": null,
                                    "status": 0,
                                    "lastPaymentOn": null,
                                    "slaDeadline": null,
                                    "missedSLACount": null,
                                    "sla": null,
                                    "daysOpen": 0,
                                    "completedOn": null,
                                    "completedBy": null,
                                    "type": null,
                                    "beneficiary": {
                                        "id": null,
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
                                    "caseDetail": {
                                        "@class": "com.commercebank.www.domain.GovRec",
                                        "id": null,
                                        "claimNumber": null,
                                        "verifiedOn": null,
                                        "fullRecovery": false,
                                        "paymentTotal": 0,
                                        "paymentCount": 0,
                                        "subtype": null,
                                        "verifiedBy": null,
                                        "recoveryInfo": {
                                            "id": null,
                                            "method": null,
                                            "detailType": null,
                                            "detailValue": null,
                                            "comment": null
                                        },
                                        "notes": null,
                                        "payments": null
                                    },
                                    //"isWatched": false,
                                    "payments": null,
                                    "notes": null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('ach-case', null, {
                            reload: true
                        });
                    }, function () {
                        $state.go('ach-case');
                    });
                }]
            })
            .state('ach-case.edit', {
                parent: 'ach-case',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
                        controller: 'CaseFormController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['ACHCase', function (ACHCase) {
                                return ACHCase.one({
                                    id: $stateParams.id
                                });


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
            .state('ach-case.delete', {
                parent: 'ach-case',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/ach-case/ach-case-delete-dialog.html',
                        controller: 'ACHCaseDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['ACHCase', function (ACHCase) {
                                return ACHCase.one({
                                    id: $stateParams.id
                                });
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
})();
