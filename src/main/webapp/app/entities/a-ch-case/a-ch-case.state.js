(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('a-ch-case', {
            parent: 'entity',
            url: '/a-ch-case',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ACHCases'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/a-ch-case/a-ch-cases.html',
                    controller: 'ACHCaseController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('a-ch-case-detail', {
            parent: 'entity',
            url: '/a-ch-case/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ACHCase'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/a-ch-case/a-ch-case-detail.html',
                    controller: 'ACHCaseDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'ACHCase', function($stateParams, ACHCase) {
                    return ACHCase.get({id : $stateParams.id});
                }]
            }
        })
        .state('a-ch-case.new', {
            parent: 'a-ch-case',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/a-ch-case/a-ch-case-dialog.html',
                    controller: 'ACHCaseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                totalAmount: null,
                                status: null,
                                lastPaymentOn: null,
                                slaDeadline: null,
                                daysOpen: null,
                                type: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('a-ch-case', null, { reload: true });
                }, function() {
                    $state.go('a-ch-case');
                });
            }]
        })
        .state('a-ch-case.edit', {
            parent: 'a-ch-case',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/a-ch-case/a-ch-case-dialog.html',
                    controller: 'ACHCaseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['ACHCase', function(ACHCase) {
                            return ACHCase.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('a-ch-case', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('a-ch-case.delete', {
            parent: 'a-ch-case',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/a-ch-case/a-ch-case-delete-dialog.html',
                    controller: 'ACHCaseDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ACHCase', function(ACHCase) {
                            return ACHCase.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('a-ch-case', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
