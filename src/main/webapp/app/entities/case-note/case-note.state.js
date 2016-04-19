(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('case-note', {
            parent: 'entity',
            url: '/case-note',
            data: {
                authorities: ['ROLE_ACHOPS'],
                pageTitle: 'CaseNotes'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/case-note/case-notes.html',
                    controller: 'CaseNoteController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('case-note-detail', {
            parent: 'entity',
            url: '/case-note/{id}',
            data: {
                authorities: ['ROLE_ACHOPS'],
                pageTitle: 'CaseNote'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/case-note/case-note-detail.html',
                    controller: 'CaseNoteDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'CaseNote', function($stateParams, CaseNote) {
                    return CaseNote.get({id : $stateParams.id});
                }]
            }
        })
        .state('case-note.new', {
            parent: 'case-note',
            url: '/new',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/case-note/case-note-dialog.html',
                    controller: 'CaseNoteDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                note: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('case-note', null, { reload: true });
                }, function() {
                    $state.go('case-note');
                });
            }]
        })
        .state('case-note.edit', {
            parent: 'case-note',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/case-note/case-note-dialog.html',
                    controller: 'CaseNoteDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['CaseNote', function(CaseNote) {
                            return CaseNote.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('case-note', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('case-note.delete', {
            parent: 'case-note',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ACHOPS']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/case-note/case-note-delete-dialog.html',
                    controller: 'CaseNoteDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['CaseNote', function(CaseNote) {
                            return CaseNote.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('case-note', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
