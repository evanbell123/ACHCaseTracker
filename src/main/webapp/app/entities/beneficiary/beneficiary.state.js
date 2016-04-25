(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('beneficiary', {
            parent: 'entity',
            url: '/beneficiary',
            data: {
                authorities: ['ROLE_ACHOPS'],
                pageTitle: 'Beneficiaries'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/beneficiary/beneficiaries.html',
                    controller: 'BeneficiaryController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('beneficiary-detail', {
            parent: 'entity',
            url: '/beneficiary/{id}',
            data: {
                authorities: ['ROLE_ACHOPS'],
                pageTitle: 'Beneficiary'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/beneficiary/beneficiary-detail.html',
                    controller: 'BeneficiaryDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Beneficiary', function($stateParams, Beneficiary) {
                    return Beneficiary.get({id : $stateParams.id});
                }]
            }
        })
        .state('beneficiary.new', {
            parent: 'beneficiary',
            url: '/new',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/beneficiary/beneficiary-dialog.html',
                    controller: 'BeneficiaryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                customerID: null,
                                name: null,
                                ssn: null,
                                accountNum: null,
                                dateOfDeath: null,
                                dateCBAware: null,
                                otherGovBenefits: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('beneficiary', null, { reload: true });
                }, function() {
                    $state.go('beneficiary');
                });
            }]
        })
        .state('beneficiary.edit', {
            parent: 'beneficiary',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/beneficiary/beneficiary-dialog.html',
                    controller: 'BeneficiaryDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Beneficiary', function(Beneficiary) {
                            return Beneficiary.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('beneficiary', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('beneficiary.delete', {
            parent: 'beneficiary',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/beneficiary/beneficiary-delete-dialog.html',
                    controller: 'BeneficiaryDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Beneficiary', function(Beneficiary) {
                            return Beneficiary.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('beneficiary', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
