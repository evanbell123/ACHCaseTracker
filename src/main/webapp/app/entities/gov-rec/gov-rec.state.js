(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('gov-rec', {
            parent: 'entity',
            url: '/gov-rec',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'GovRecs'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gov-rec/gov-recs.html',
                    controller: 'GovRecController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('gov-rec-detail', {
            parent: 'entity',
            url: '/gov-rec/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'GovRec'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/gov-rec/gov-rec-detail.html',
                    controller: 'GovRecDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'GovRec', function($stateParams, GovRec) {
                    return GovRec.get({id : $stateParams.id});
                }]
            }
        })
        .state('gov-rec.new', {
            parent: 'gov-rec',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gov-rec/gov-rec-dialog.html',
                    controller: 'GovRecDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                claimNumber: null,
                                completedOn: null,
                                verifiedOn: null,
                                paymentTotal: null,
                                paymentCount: null,
                                subtype: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('gov-rec', null, { reload: true });
                }, function() {
                    $state.go('gov-rec');
                });
            }]
        })
        .state('gov-rec.edit', {
            parent: 'gov-rec',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gov-rec/gov-rec-dialog.html',
                    controller: 'GovRecDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['GovRec', function(GovRec) {
                            return GovRec.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('gov-rec', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('gov-rec.delete', {
            parent: 'gov-rec',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/gov-rec/gov-rec-delete-dialog.html',
                    controller: 'GovRecDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['GovRec', function(GovRec) {
                            return GovRec.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('gov-rec', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
