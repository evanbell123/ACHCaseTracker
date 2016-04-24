(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('sla', {
            parent: 'admin',
            url: '/sla',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'SLAS'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/sla/sla.html',
                    controller: 'SLAController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('sla-detail', {
            parent: 'admin',
            url: '/sla/{id}',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'SLA'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/sla/sla-detail.html',
                    controller: 'SLADetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'SLA', function($stateParams, SLA) {
                    return SLA.get({id : $stateParams.id});
                }]
            }
        })
        .state('sla.new', {
            parent: 'sla',
            url: '/new',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/sla/sla-dialog.html',
                    controller: 'SLADialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: null,
                                businessDays: 0
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('sla', null, { reload: true });
                }, function() {
                    $state.go('sla');
                });
            }]
        })
        .state('sla.edit', {
            parent: 'sla',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/sla/sla-dialog.html',
                    controller: 'SLADialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['SLA', function(SLA) {
                            return SLA.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('sla', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('sla.delete', {
            parent: 'sla',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/admin/sla/sla-delete-dialog.html',
                    controller: 'SLADeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SLA', function(SLA) {
                            return SLA.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('sla', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
