(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('s-la', {
            parent: 'entity',
            url: '/s-la',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'SLAS'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/s-la/s-las.html',
                    controller: 'SLAController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('s-la-detail', {
            parent: 'entity',
            url: '/s-la/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'SLA'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/s-la/s-la-detail.html',
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
        .state('s-la.new', {
            parent: 's-la',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/s-la/s-la-dialog.html',
                    controller: 'SLADialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                businessDays: null,
                                typeName: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('s-la', null, { reload: true });
                }, function() {
                    $state.go('s-la');
                });
            }]
        })
        .state('s-la.edit', {
            parent: 's-la',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/s-la/s-la-dialog.html',
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
                    $state.go('s-la', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('s-la.delete', {
            parent: 's-la',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/s-la/s-la-delete-dialog.html',
                    controller: 'SLADeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['SLA', function(SLA) {
                            return SLA.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('s-la', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
