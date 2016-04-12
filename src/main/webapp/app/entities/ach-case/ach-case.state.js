(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('ach-case', {
            parent: 'entity',
            url: '/ach-case',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'ACHCases'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/ach-case/ach-case.html',
                    controller: 'ACHCaseController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('ach-case-detail', {
            parent: 'entity',
            url: '/ach-case/{id}',
            data: {
                authorities: ['ROLE_USER'],
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
                    return ACHCase.get({id : $stateParams.id});
                }]
            }
        })
        .state('ach-case.new', {
            parent: 'ach-case',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/ach-case/ach-case-dialog.html',
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
                    $state.go('ach-case', null, { reload: true });
                }, function() {
                    $state.go('ach-case');
                });
            }]
        })
        .state('ach-case.edit', {
            parent: 'ach-case',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
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
                            return ACHCase.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('ach-case', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('ach-case.delete', {
            parent: 'ach-case',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/ach-case/ach-case-delete-dialog.html',
                    controller: 'ACHCaseDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['ACHCase', function(ACHCase) {
                            return ACHCase.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('ach-case', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
