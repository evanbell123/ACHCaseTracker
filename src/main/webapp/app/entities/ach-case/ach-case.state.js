(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('ach-case-two', {
            parent: 'entity',
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
            resolve: {
            }
        })
        .state('my-cases-two', {
            parent: 'entity',
            url: '/my-cases/',
            data: {
                authorities: ['ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN'],
                pageTitle: 'My Cases'
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
        .state('ach-case-detail-two', {
            parent: 'entity',
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
                entity: ['$stateParams', 'ACHCase', function($stateParams, ACHCase) {
                    return ACHCase.get({id : $stateParams.id});
                }]
<<<<<<< HEAD
            })
            .state('ach-case.edit', {
                parent: 'ach-case',
                url: '/{id}/edit',
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
=======
            }
        })
        .state('ach-case-two.new', {
            parent: 'ach-case',
            url: '/new',
            data: {
                authorities: ['ROLE_CALLCENTER', 'ROLE_ACHOPS', 'ROLE_MANAGER', 'ROLE_ADMIN']
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
                                assignedTo: null,
                                totalAmount: null,
                                status: null,
                                lastPaymentOn: null,
                                slaDeadline: null,
                                daysOpen: null,
                                type: null,
                                id: null,
                                beneficiary: {
                                    name: null
                                }
                            };
>>>>>>> e796f8ab5be5a250b00d983798059d48054747ce
                        }
                    }
                }).result.then(function() {
                    $state.go('ach-case', null, { reload: true });
                }, function() {
                    $state.go('ach-case');
                });
            }]
        })
        .state('ach-case-two.edit', {
            parent: 'ach-case',
            url: '/{id}/edit',
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
        .state('ach-case-two.delete', {
            parent: 'ach-case',
            url: '/{id}/delete',
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
