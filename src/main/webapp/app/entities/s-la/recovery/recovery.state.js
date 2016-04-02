(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('recovery', {
            parent: 'entity',
            url: '/recovery',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Recoveries'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/recovery/recoveries.html',
                    controller: 'RecoveryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('recovery-detail', {
            parent: 'entity',
            url: '/recovery/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Recovery'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/recovery/recovery-detail.html',
                    controller: 'RecoveryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Recovery', function($stateParams, Recovery) {
                    return Recovery.get({id : $stateParams.id});
                }]
            }
        })
        .state('recovery.new', {
            parent: 'recovery',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/recovery/recovery-dialog.html',
                    controller: 'RecoveryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                method: null,
                                detailType: null,
                                detailValue: null,
                                comment: null,
                                fullRecovery: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('recovery', null, { reload: true });
                }, function() {
                    $state.go('recovery');
                });
            }]
        })
        .state('recovery.edit', {
            parent: 'recovery',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/recovery/recovery-dialog.html',
                    controller: 'RecoveryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Recovery', function(Recovery) {
                            return Recovery.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('recovery', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('recovery.delete', {
            parent: 'recovery',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/recovery/recovery-delete-dialog.html',
                    controller: 'RecoveryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Recovery', function(Recovery) {
                            return Recovery.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('recovery', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
